import asyncio
import json

from typing import AsyncIterable
from langchain.callbacks import AsyncIteratorCallbackHandler
from app.application.handlers.BaseHandler import BaseHandler
from app.application.queries.ScraperUrlQuery import ScraperUrlQuery
from app.utils.stream_helpers import StreamManager

class ScraperUrlHandler(BaseHandler):
    def __init__(self, llm_service, vectorstore_service, document_service, template_service):
        self.llm_service = llm_service
        self.vectorstore_service = vectorstore_service
        self.document_service = document_service
        self.template_service = template_service
        
    async def handle(self, query: ScraperUrlQuery) -> AsyncIterable[str]:
        """Process RAG workflow and stream results back to client"""
        stream_manager = StreamManager()
        
        try:
            # Step 1: Load and split content
            async def load_content():
                return await self.document_service.load_and_split_web_content(query.url, query.force_reload)
                
            def extract_docs_data(docs):
                return {"count": len(docs)}
                
            all_split_docs = None
            async for message in stream_manager.execute_step(
                "loading", 
                load_content,
                "Loading content from URL", 
                f"Content loaded successfully", 
                extract_docs_data
            ):
                yield message
                if "success" in message:
                    # Extract result from the async generator
                    all_split_docs = await load_content()
            
            # Step 2: Create embeddings
            async def create_embeddings():
                return self.vectorstore_service.store_documents(all_split_docs, query.url)
                
            vectorstore = None
            async for message in stream_manager.execute_step(
                "embedding",
                create_embeddings,
                "Creating vector embeddings",
                "Vector embeddings created successfully"
            ):
                yield message
                if "success" in message:
                    vectorstore = await create_embeddings()
                    
            # Step 3: Retrieve relevant documents
            context = "No relevant information found."
            
            yield stream_manager.create_status_message(
                "start", 
                "retrieval", 
                "Retrieving relevant information"
            )
            
            try:
                relevant_docs = vectorstore.similarity_search(query.prompt, k=4)
                
                context_parts = []
                for doc in relevant_docs:
                    if hasattr(doc, 'page_content'):
                        context_parts.append(doc.page_content)
                
                if context_parts:
                    context = "\n\n".join(context_parts)
                    yield stream_manager.create_status_message(
                        "success", 
                        "retrieval", 
                        f"Found {len(relevant_docs)} relevant documents",
                        {"count": len(relevant_docs), "context_length": len(context)}
                    )
                else:
                    yield stream_manager.create_status_message(
                        "info", 
                        "retrieval", 
                        "No directly relevant information found"
                    )
            except Exception as e:
                yield stream_manager.create_status_message(
                    "error", 
                    "retrieval", 
                    f"Failed to retrieve documents: {str(e)}"
                )
                # We continue with empty context instead of raising an exception
            
            yield stream_manager.create_status_message("start", "generation", "Generating answer")
            
            template = self.template_service.get_template("rag")
            formatted_prompt = template.format(context=context, query=query.prompt)
            
            # Create the callback handler directly here for more control
            callback = AsyncIteratorCallbackHandler()
            llm = self.llm_service.get_llm(query.model, callbacks=[callback])
            
            # Start generation task
            task = asyncio.create_task(llm.ainvoke(formatted_prompt))
            
            # Stream tokens directly without going through stream_manager
            try:
                async for token in callback.aiter():
                    # Format exactly as expected by frontend
                    message = f"data: {{\"type\": \"content\", \"token\": {json.dumps(token)}}}\n\n"
                    yield message
                    
                yield stream_manager.create_status_message(
                    "success", 
                    "generation", 
                    "Answer generated successfully"
                )
            except Exception as e:
                yield stream_manager.create_status_message(
                    "error", 
                    "generation", 
                    f"Error during generation: {str(e)}"
                )
            finally:
                callback.done.set()
                
                try:
                    await task
                except Exception as e:
                    print(f"Task error: {e}")
                    
        except Exception as e:
            yield stream_manager.create_status_message(
                "error", 
                "process", 
                f"Unexpected error: {str(e)}"
            )