import asyncio
import json
from typing import AsyncIterable
from langchain.callbacks import AsyncIteratorCallbackHandler

from app.application.handlers.BaseHandler import BaseHandler
from app.application.queries.LadderChatQuery import LadderChatQuery
from app.utils.stream_helpers import StreamManager

class LadderChatHandler(BaseHandler):
    def __init__(self, llm_service, template_service):
        self.llm_service = llm_service
        self.template_service = template_service
        
    async def handle(self, query: LadderChatQuery) -> AsyncIterable[str]:
        """Process ladder chat and stream results back to client"""
        stream_manager = StreamManager()
        
        try:
            # Step 1: Send status message for processing
            yield stream_manager.create_status_message(
                "start", 
                "processing", 
                "Processing your request"
            )
            
            # Get ladder template
            template = self.template_service.get_template("ladder")
            formatted_prompt = template.format(user_prompt=query.prompt)
            
            # Send status message for generation
            yield stream_manager.create_status_message(
                "start", 
                "generation", 
                "Generating ladder response"
            )
            
            # Create the callback handler for streaming
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
                    "Ladder generated successfully"
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