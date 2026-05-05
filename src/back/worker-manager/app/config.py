import os

class Config:
    GRPC_PORT:         int = int(os.getenv("GRPC_PORT", "6000"))
    DOCKER_SOCKET:     str = os.getenv("DOCKER_SOCKET", "unix://var/run/docker.sock")
    WORKER_IMAGE:      str = os.getenv("WORKER_IMAGE", "menterview/ai-worker:latest")
    WORKER_HOST:       str = os.getenv("WORKER_HOST", "localhost")
    OLLAMA_HOST:       str = os.getenv("OLLAMA_HOST", "http://menterview.ollama:11434")
    OLLAMA_MODEL:      str = os.getenv("OLLAMA_MODEL", "llama3.2")
    CALLBACK_ADDRESS:  str = os.getenv("CALLBACK_ADDRESS", "menterview.api:5001")
    DEFAULT_TIMEOUT:   int = int(os.getenv("DEFAULT_TIMEOUT", "3600"))
    PORT_RANGE_START:  int = int(os.getenv("PORT_RANGE_START", "51000"))
    PORT_RANGE_END:    int = int(os.getenv("PORT_RANGE_END", "52000"))