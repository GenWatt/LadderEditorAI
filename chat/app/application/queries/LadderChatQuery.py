from pydantic import BaseModel

class LadderChatQuery(BaseModel):
    prompt: str
    model: str = "gemma"
    force_reload: bool = False

    class Config:
        schema_extra = {
            "example": {
                "prompt": "Please summarize the content of this page.",
                "model": "gemma",
                "force_reload": True
            }
        }