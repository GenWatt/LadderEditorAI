from fastapi import Depends
from typing import Annotated

from app.application.services.LLMService import LLMService
from app.application.services.VectorstoreService import VectorstoreService
from app.application.services.DocumentService import DocumentService
from app.application.services.TemplateService import TemplateService

# Service providers
def get_llm_service() -> LLMService:
    return LLMService()

def get_vectorstore_service() -> VectorstoreService:
    return VectorstoreService()

def get_document_service() -> DocumentService:
    return DocumentService()

def get_template_service() -> TemplateService:
    return TemplateService()

# Dependency annotations for cleaner code
LLMServiceDep = Annotated[LLMService, Depends(get_llm_service)]
VectorstoreServiceDep = Annotated[VectorstoreService, Depends(get_vectorstore_service)]
DocumentServiceDep = Annotated[DocumentService, Depends(get_document_service)]
TemplateServiceDep = Annotated[TemplateService, Depends(get_template_service)]
