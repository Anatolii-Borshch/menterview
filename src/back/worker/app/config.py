import os

class Config:
    SESSION_ID:       int  = int(os.environ["SESSION_ID"])
    SESSION_TOKEN:    str  = os.environ["SESSION_TOKEN"]
    CALLBACK_ADDRESS: str  = os.environ["CALLBACK_ADDRESS"]
    GRPC_PORT:        int  = int(os.getenv("GRPC_PORT", "50051"))
    WS_PORT:          int  = int(os.getenv("WS_PORT", "8765"))
    SESSION_TIMEOUT:  int  = int(os.getenv("SESSION_TIMEOUT", "3600"))
    OLLAMA_HOST:      str  = os.getenv("OLLAMA_HOST", "http://localhost:11434")
    OLLAMA_MODEL:     str  = os.getenv("OLLAMA_MODEL", "llama3.2")
    QUESTIONS_JSON:   str  = os.environ["QUESTIONS_JSON"]