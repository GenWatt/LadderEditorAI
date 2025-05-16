import asyncio
import json
from typing import AsyncGenerator

async def generate_response(stream_manager, llm_service, template_service, model_name, context, prompt) -> AsyncGenerator[str, None]:
    """Generate a response using the LLM"""
    # Send start status
    yield stream_manager.create_status_message("start", "generation", "Generating answer")
    
    template = template_service.get_template("rag")
    formatted_prompt = template.format(context=context, query=prompt)
    
    # Create the callback handler
    from langchain.callbacks import AsyncIteratorCallbackHandler
    callback = AsyncIteratorCallbackHandler()
    llm = llm_service.get_llm(model_name, callbacks=[callback])
    
    # Start generation task
    task = asyncio.create_task(llm.ainvoke(formatted_prompt))
    
    try:
        async for token in callback.aiter():
            # Format as expected by frontend
            message = f"data: {{\"type\": \"content\", \"token\": {json.dumps(token)}}}\n\n"
            yield message
            
        yield stream_manager.create_status_message(
            "success", 
            "generation", 
            "Answer generated successfully"
        )
    except Exception as e:
        print(f"Streaming error: {str(e)}")
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
