from typing import Any, AsyncIterable

class BaseHandler:
    """Base class for all handlers in the application."""
    
    async def handle(self, query: Any) -> AsyncIterable[str]:
        """
        Process a query and return an async iterable of string responses.
        
        Args:
            query: The query to process
            
        Returns:
            An async iterable of string responses
        """
        raise NotImplementedError("Subclasses must implement this method")