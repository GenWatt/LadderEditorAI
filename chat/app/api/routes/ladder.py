from fastapi import APIRouter, HTTPException, Request, Depends
from fastapi.responses import StreamingResponse
from typing import Annotated

from app.application.handlers.LadderChatHandler import LadderChatHandler
from app.application.queries.LadderChatQuery import LadderChatQuery
from app.dependencies import (
    LLMServiceDep,
    TemplateServiceDep
)

router = APIRouter()

def get_ladder_handler(
    llm_service: LLMServiceDep,
    template_service: TemplateServiceDep
) -> LadderChatHandler:
    return LadderChatHandler(
        llm_service,
        template_service
    )

LadderHandlerDep = Annotated[LadderChatHandler, Depends(get_ladder_handler)]

@router.post("/stream-ladder")
async def stream_ladder(
    request: Request,
    handler: LadderHandlerDep
):
    body = await request.json()
    query = LadderChatQuery(
        prompt=body.get("prompt"),
        model=body.get("model", "gemma"),
        force_reload=body.get("force_reload", False)
    )
    
    if not query.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
    
    return StreamingResponse(
        handler.handle(query),
        media_type="text/event-stream"
    )