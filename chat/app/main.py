from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import traceback

from app.routes import streamScraper

app = FastAPI(title="Chat API", description="API for chat and RAG applications")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(streamScraper.router, prefix="/api", tags=["scraper"])

# Error handling middleware
@app.middleware("http")
async def exception_handler(request: Request, call_next):
    try:
        return await call_next(request)
    except Exception as e:
        # Log the exception
        error_detail = {
            "error": str(e),
            "traceback": traceback.format_exc()
        }
        print(f"Unhandled exception: {error_detail}")
        
        # Return a JSON response with the error
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error", "error": str(e)}
        )

@app.get("/")
def read_root():
    return {"message": "Welcome to the Chat API"}
