from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core import settings
from app.api.routes import base, streamScraper, ladder, avaliable_models

# Create required directories
os.makedirs("./data/chroma", exist_ok=True)
os.makedirs("./data/document_cache", exist_ok=True)

app = FastAPI(
    title=settings.settings.PROJECT_NAME,
    description=settings.settings.PROJECT_DESCRIPTION,
    version=settings.settings.PROJECT_VERSION
)

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(base.router)
app.include_router(streamScraper.router, prefix="/api", tags=["streamScraper"])
app.include_router(ladder.router, prefix="/api", tags=["ladder"])
app.include_router(avaliable_models.router, prefix="/api", tags=["available-models"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=5000, reload=True)