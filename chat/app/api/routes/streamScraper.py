from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from typing import Annotated

from app.application.handlers.ScraperUrlHandler import ScraperUrlHandler
from app.application.queries.ScraperUrlQuery import ScraperUrlQuery
from app.dependencies import (
    LLMServiceDep,
    VectorstoreServiceDep,
    DocumentServiceDep,
    TemplateServiceDep
)

router = APIRouter()

def get_scraper_handler(
    llm_service: LLMServiceDep,
    vectorstore_service: VectorstoreServiceDep,
    document_service: DocumentServiceDep,
    template_service: TemplateServiceDep
) -> ScraperUrlHandler:
    return ScraperUrlHandler(
        llm_service,
        vectorstore_service,
        document_service,
        template_service
    )

ScraperHandlerDep = Annotated[ScraperUrlHandler, Depends(get_scraper_handler)]

@router.post("/stream-scraper")
async def stream_scraper(
    request: Request,
    handler: ScraperHandlerDep
):
    body = await request.json()
    query = ScraperUrlQuery(
        url=body.get("url"),
        prompt=body.get("prompt"),
        model=body.get("model", "gemma"),
        force_reload=body.get("force_reload", False)
    )
    
    if not query.url:
        raise HTTPException(status_code=400, detail="URL is required")
        
    if not query.prompt:
        raise HTTPException(status_code=400, detail="prompt is required")
    
    return StreamingResponse(
        handler.handle(query),
        media_type="text/event-stream"
    )