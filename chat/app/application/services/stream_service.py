import json
from typing import Any, Dict, Callable, Coroutine, Optional, AsyncGenerator

class StreamManager:
    """Manages streaming operations and provides consistent status messages"""
    
    def create_status_message(
        self, 
        status: str, 
        step: str, 
        message: str, 
        data: Dict[str, Any] = None
    ) -> str:
        """Create a formatted status message for the stream"""
        status_data = {
            "type": "status",
            "status": status,
            "step": step,
            "message": message
        }
        
        if data:
            status_data["data"] = data
            
        return f"data: {json.dumps(status_data)}\n\n"
    
    async def stream_operation(
        self,
        step: str,
        operation: Callable[[], Coroutine[Any, Any, Any]],
        start_message: str,
        success_message: str,
        data_extractor: Optional[Callable[[Any], Dict[str, Any]]] = None
    ) -> AsyncGenerator[str, None]:
        """Execute an operation and stream status updates"""
        # Send start message
        yield self.create_status_message("start", step, start_message)
        
        try:
            # Execute the operation but don't return its result
            # We'll let the caller execute the operation again to get the actual result
            result = await operation()
            
            # Prepare success data
            success_data = None
            if data_extractor and result:
                success_data = data_extractor(result)
                
            # Send success message
            yield self.create_status_message("success", step, success_message, success_data)
            
        except Exception as e:
            # Send error message
            yield self.create_status_message("error", step, f"Error: {str(e)}")
            raise
