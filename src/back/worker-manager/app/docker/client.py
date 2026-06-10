import json
import asyncio
import docker
import logging
from datetime import datetime, timedelta
from app.config import Config
from app.registry.models import ContainerRecord, WorkerStatus

logger = logging.getLogger(__name__)

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
        logger.info(
            "Spawning worker container: session_id=%s image=%s grpc_port=%s ws_port=%s callback=%s",
            session_id,
            Config.WORKER_IMAGE,
            grpc_port,
            ws_port,
            callback_address,
        )
        container = self._client.containers.run(
            image=Config.WORKER_IMAGE,
            detach=True,
            auto_remove=True,
            name=f"ai-worker-session-{session_id}",
            labels={
                "menterview.managed": "true",
                "menterview.component": "ai-worker",
                "menterview.session_id": str(session_id),
            },
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

        logger.info(
            "Worker container started: session_id=%s container_id=%s",
            session_id,
            container.id,
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
            logger.info("Worker container stopped: container_id=%s", container_id)
        except docker.errors.NotFound:
            logger.warning("Worker container already missing on stop: container_id=%s", container_id)
            pass

    def is_running(self, container_id: str) -> bool:
        try:
            container = self._client.containers.get(container_id)
            return container.status == "running"
        except docker.errors.NotFound:
            logger.warning("Worker container not found during health check: container_id=%s", container_id)
            return False

    def cleanup_session_workers(self, name_prefix: str = "ai-worker-session-") -> int:
        containers = self._client.containers.list(all=True, filters={"name": name_prefix})
        cleaned = 0

        for container in containers:
            try:
                logger.info("Cleaning up worker container: name=%s id=%s", container.name, container.id)
                if container.status == "running":
                    container.stop(timeout=5)
                container.remove(force=True)
                cleaned += 1
            except docker.errors.NotFound:
                logger.info("Worker container already removed during cleanup: id=%s", container.id)
            except Exception:
                logger.exception("Failed to cleanup worker container: name=%s id=%s", container.name, container.id)

        if cleaned:
            logger.info("Worker cleanup complete: removed=%s prefix=%s", cleaned, name_prefix)
        else:
            logger.info("Worker cleanup found nothing: prefix=%s", name_prefix)

        return cleaned