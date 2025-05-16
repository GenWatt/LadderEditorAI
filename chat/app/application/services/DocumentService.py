from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from app.core.CustomLoader import CustomSeleniumLoader
from typing import List, Optional
import hashlib
import os

class DocumentService:
    """Service for loading and processing documents"""
    
    def __init__(self, cache_dir: str = "./data/document_cache"):
        self.cache_dir = cache_dir
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len
        )
        
        # Ensure cache directory exists
        os.makedirs(self.cache_dir, exist_ok=True)
    
    def _get_cache_path(self, url: str) -> str:
        """Get cache path for a URL"""
        url_hash = hashlib.md5(url.encode()).hexdigest()
        return os.path.join(self.cache_dir, f"{url_hash}.txt")
    
    async def load_and_split_web_content(self, url: str, force_reload: bool = False) -> List[Document]:
        """Load content from web URL and split into chunks"""
        if not force_reload:
            # Check cache first
            cached_docs = self._try_load_from_cache(url)
            if cached_docs:
                return cached_docs
        
        # Load from web
        loader = CustomSeleniumLoader(
            urls=[url],
            wait_time=1,
        )
        
        data = loader.load()
        
        # Cache the raw content
        self._cache_documents(url, data)
        
        # Split documents
        return self.text_splitter.split_documents(data)
    
    def _try_load_from_cache(self, url: str) -> Optional[List[Document]]:
        """Try to load documents from cache"""
        cache_path = self._get_cache_path(url)
        
        if os.path.exists(cache_path):
            with open(cache_path, 'r', encoding='utf-8') as f:
                content = f.read()
                
            # Create a single document with the content
            doc = Document(page_content=content, metadata={"source": url})
            
            # Split and return
            return self.text_splitter.split_documents([doc])
        
        return None
    
    def _cache_documents(self, url: str, documents: List[Document]) -> None:
        """Cache documents for a URL"""
        cache_path = self._get_cache_path(url)
        
        # Combine all document contents
        combined_content = "\n\n".join(doc.page_content for doc in documents)
        
        with open(cache_path, 'w', encoding='utf-8') as f:
            f.write(combined_content)