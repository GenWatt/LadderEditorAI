from langchain_ollama import OllamaLLM
from typing import Dict, Any, Optional, List

class LLMService:
    """Service for interacting with LLM models"""
    
    def __init__(self, base_url: str = "http://localhost:11434"):
        self.base_url = base_url
        self.models:List[Dict[str, str]] = [
            {
                "id": "gemma",
                "name": "Gemma 4B",
                "full_name": "gemma3:4b-it-qat",
                "description": "Google's lightweight open model",
                "max_tokens": 4096,
                "is_default": True
            },
            {
                "id": "llama",
                "name": "Llama 2 7B",
                "description": "Meta's open LLM",
                "full_name": "llama2:7b",
                "max_tokens": 4096,
                "is_default": False
            }
        ]
    
    def get_llm(self, model_name: str = "gemma", callbacks: Optional[List[Any]] = None) -> OllamaLLM:
        """Get an LLM instance"""
        model: Dict[str, str] = next((model for model in self.models if model["id"] == model_name), None)
        print(f"Using model: {model}")
        llm_kwargs = {
            "base_url": self.base_url,
            "model": model["full_name"],
        }
        
        if callbacks:
            llm_kwargs["callbacks"] = callbacks
            
        return OllamaLLM(**llm_kwargs)
    
    def get_available_models(self) -> List[Dict[str, str]]:
        """Get a dictionary of available models"""
        return self.models