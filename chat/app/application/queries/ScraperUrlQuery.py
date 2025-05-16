from pydantic import BaseModel

class ScraperUrlQuery(BaseModel):
    url: str
    prompt: str
    model: str = "gemma"
    force_reload: bool = False

    class Config:
        schema_extra = {
            "example": {
                "url": "https://example.com",
                "prompt": "Please summarize the content of this page.",
                "model": "gemma",
                "force_reload": True
            }
        }