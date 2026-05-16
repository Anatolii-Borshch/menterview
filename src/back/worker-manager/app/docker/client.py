import json
import asyncio
import docker
from datetime import datetime, timedelta
from app.config import Config
from app.registry.models import ContainerRecord, WorkerStatus

class DockerManager:
    def __init__(self):
        self._client = docker.from_env()

    def spawn_worker(
        self,
        session_id:       int,
        session_token:    str,
        callback_address: str,
        questions:        list[dict],
        grpc_port:        int,
        ws_port:          int,
        timeout_seconds:  int,
    ) -> ContainerRecord:
        container = self._client.containers.run(
            image=Config.WORKER_IMAGE,
            detach=True,
            auto_remove=True,
            name=f"ai-worker-session-{session_id}",
            environment={
                "SESSION_ID":       str(session_id),
                "SESSION_TOKEN":    session_token,
                "CALLBACK_ADDRESS": callback_address,
                "GRPC_PORT":        "50051",
                "WS_PORT":          "8765",
                "SESSION_TIMEOUT":  str(timeout_seconds),
                "OLLAMA_HOST":      Config.OLLAMA_HOST,
                "OLLAMA_MODEL":     Config.OLLAMA_MODEL,
                "QUESTIONS_JSON":   json.dumps(questions),
            },
            ports={
                "50051/tcp": grpc_port,
                "8765/tcp":  ws_port,
            },
            network="menterview-network",
        )

        return ContainerRecord(
            session_id=session_id,
            container_id=container.id,
            grpc_host=f"{Config.WORKER_HOST}:{grpc_port}",
            ws_host=f"{Config.WORKER_HOST}:{ws_port}",
            grpc_port=grpc_port,
            ws_port=ws_port,
            status=WorkerStatus.RUNNING,
            spawned_at=datetime.utcnow(),
            timeout_at=datetime.utcnow() + timedelta(seconds=timeout_seconds),
        )

    def stop_worker(self, container_id: str):
        try:
            container = self._client.containers.get(container_id)
            container.stop(timeout=5)
        except docker.errors.NotFound:
            pass

    def is_running(self, container_id: str) -> bool:
        try:
            container = self._client.containers.get(container_id)
            return container.status == "running"
        except docker.errors.NotFound:
            return False