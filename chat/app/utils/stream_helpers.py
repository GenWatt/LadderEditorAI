import json
from typing import Dict, AsyncIterable, Any, List, Callable, Awaitable, Optional
from langchain.callbacks import AsyncIteratorCallbackHandler

class StreamManager:
    """Helper class to manage streaming responses"""
    
    @staticmethod
    def create_status_message(status: str, step: str, message: str, data: Dict = None) -> str:
        """Create a structured status message for the frontend"""
        payload = {
            "type": "status",
            "status": status,  # 'start', 'success', 'error', 'info'
            "step": step,      # 'loading', 'embedding', 'retrieval', 'generation'
            "message": message
        }
        if data:
            payload["data"] = data
            
        return f"data: {json.dumps(payload)}\n\n"

    @staticmethod
    def create_content_message(token: str) -> str:
        """Create a content message for the frontend"""
        payload = {
            "type": "content",
            "token": token
        }
        return f"data: {json.dumps(payload)}\n\n"
    
    @staticmethod
    async def execute_step(
        step_name: str,
        action: Callable[[], Awaitable[Any]],
        on_start_message: str,
        on_success_message: str,
        data_extractor: Optional[Callable[[Any], Dict]] = None
    ) -> AsyncIterable[str]:
        """Execute a step with proper status messages"""
        yield StreamManager.create_status_message("start", step_name, on_start_message)
        
        try:
            result = await action()
            
            data = None
            if data_extractor:
                data = data_extractor(result)
                
            yield StreamManager.create_status_message(
                "success", 
                step_name, 
                on_success_message,
                data
            )
            
            # Cannot return value in async generator
            # Instead, yield a special message containing the result if needed
            yield StreamManager.create_status_message(
                "result", 
                step_name, 
                "Result data",
                {"result": "completed", "step": step_name}
            )
        except Exception as e:
            error_message = f"Error in {step_name}: {str(e)}"
            yield StreamManager.create_status_message("error", step_name, error_message)
            raise e

    @staticmethod
    async def stream_llm_response(
        llm_service,
        prompt: str,
        model_name: str
    ) -> AsyncIterable[str]:
        """Stream LLM response with proper handling"""
        callback = AsyncIteratorCallbackHandler()
        llm = llm_service.get_llm(model_name, callbacks=[callback])
        
        full_response = []
        task = None
        
        try:
            # Start LLM generation
            task = llm.ainvoke(prompt)
            
            # Stream tokens as they arrive
            async for token in callback.aiter():
                full_response.append(token)
                yield StreamManager.create_content_message(token)
                
            yield StreamManager.create_status_message(
                "success", 
                "generation", 
                "Answer generated successfully"
            )
        except Exception as e:
            yield StreamManager.create_status_message(
                "error", 
                "generation", 
                f"Error during generation: {str(e)}"
            )
            raise e
        finally:
            # Ensure callback is properly closed
            if callback:
                callback.done.set()
            
            # Wait for task to complete if it exists
            if task:
                try:
                    await task
                except Exception:
                    # Task exception will have already been handled
                    pass
        
        # Cannot return value in async generator
        # Instead, yield a special message with the full response if needed
        yield StreamManager.create_status_message(
            "result",
            "generation",
            "Generation completed",
            {"full_response": "".join(full_response)}
        )
