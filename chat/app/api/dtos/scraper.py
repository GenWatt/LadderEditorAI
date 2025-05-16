from pydantic import BaseModel

class StreamScraperRequest(BaseModel):
    url: str
    prompt: str
    model: str = "gemma"
    force_reload: bool = False
