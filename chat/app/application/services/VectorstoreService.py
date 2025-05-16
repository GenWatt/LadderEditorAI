from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma 
from langchain_core.documents import Document
from typing import List, Optional
import os
import hashlib

class VectorstoreService:
    """Service for managing vectorstores"""
    
    def __init__(self, base_path: str = "./data/chroma"):
        self.base_path = base_path
        self.embeddings = OllamaEmbeddings(
            base_url="http://localhost:11434", 
            model="nomic-embed-text"
        )
    
    def _get_collection_name(self, source_id: str) -> str:
        """Generate a deterministic collection name based on source ID"""
        return hashlib.md5(source_id.encode()).hexdigest()
    
    def store_documents(self, documents: List[Document], source_id: str) -> Chroma:
        """Store documents in a vectorstore with a collection named after source_id"""
        collection_name = self._get_collection_name(source_id)
        print(f"Storing documents in collection: {collection_name}")
        persist_directory = os.path.join(self.base_path, collection_name)
        
        # Make sure the directory exists
        os.makedirs(self.base_path, exist_ok=True)
        
        # Check if collection already exists
        if os.path.exists(persist_directory):
            print(f"Collection {collection_name} already exists. Loading existing vectorstore.")
            vectorstore = Chroma(
                collection_name=collection_name,
                embedding_function=self.embeddings,
                persist_directory=persist_directory
            )
            
            # Add new documents if any
            if documents and len(documents) > 0:
                print(f"Adding {len(documents)} new documents to existing collection")
                vectorstore.add_documents(documents)
                # No need to call persist() as changes are automatically persisted
        else:
            print(f"Creating new collection: {collection_name}")
            vectorstore = Chroma.from_documents(
                documents=documents,
                embedding=self.embeddings,
                collection_name=collection_name,
                persist_directory=persist_directory
            )
            # No need to call persist() as changes are automatically persisted
            
        return vectorstore
    
    def get_retriever_for_source(self, source_id: str) -> Optional[Chroma]:
        """Get a retriever for a specific source if it exists"""
        collection_name = self._get_collection_name(source_id)
        persist_directory = os.path.join(self.base_path, collection_name)
        
        if os.path.exists(persist_directory):
            vectorstore = Chroma(
                collection_name=collection_name,
                embedding_function=self.embeddings,
                persist_directory=persist_directory
            )
            # Configure and return the retriever
            return vectorstore.as_retriever(
                search_type="similarity",
                search_kwargs={"k": 4}  # Retrieve top 4 most relevant documents
            )
        
        return None