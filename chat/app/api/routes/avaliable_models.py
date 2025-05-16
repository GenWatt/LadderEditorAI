from fastapi import APIRouter, Request
from typing import Dict, Any
from app.application.services.LLMService import LLMService

router = APIRouter()
llm_service = LLMService()

@router.get("/available-models")
async def get_available_models(request: Request) -> Dict[str, Any]:
    """
    Returns a list of all available language models with their metadata.
    
    Example response:
    {
        "models": [
            {
                "id": "gemma",
                "name": "Gemma 7B",
                "description": "Google's lightweight open model",
                "max_tokens": 8192,
                "is_default": true
            },
            {
                "id": "llama",
                "name": "Llama 2 7B",
                "description": "Meta's open LLM",
                "max_tokens": 4096,
                "is_default": false
            }
        ],
        "default_model": "gemma"
    }
    """
    # Get available models from the LLM service
    models = llm_service.get_available_models()
    
    # Find the default model
    default_model = next((model["id"] for model in models if model.get("is_default")), 
                        models[0]["id"] if models else None)
    
    return {
        "models": models,
        "defaultModel": default_model
    }