import sys
sys.path.insert(0, '/worker-manager/generated')

import asyncio
import logging
import manager_pb2
import manager_pb2_grpc
from app.docker.client import DockerManager
from app.docker.port_allocator import PortAllocator
from app.registry.registry import ContainerRegistry
from app.registry.models import WorkerStatus
from app.config import Config

logger = logging.getLogger(__name__)

class ManagerServicer(manager_pb2_grpc.ManagerServiceServicer):
    def __init__(
        self,
        docker:    DockerManager,
        allocator: PortAllocator,
        registry:  ContainerRegistry,
    ):
        self._docker    = docker
        self._allocator = allocator
        self._registry  = registry

    async def SpawnWorker(self, request, context):
        logger.info(
            "SpawnWorker requested: session_id=%s questions=%s timeout=%s",
            request.session_id,
            len(request.questions),
            request.timeout_seconds or Config.DEFAULT_TIMEOUT,
        )

        questions = [
            {
                "question_id":    q.question_id,
                "question_text":  q.question_text,
                "answer":         q.answer,
                "category_id":    q.category_id,
                "difficulty_id":  q.difficulty_id,
                "is_weak_topic":  q.is_weak_topic,
                "rephrased_text": q.rephrased_text,
                "tag_ids":        list(q.tag_ids),
            }
            for q in request.questions
        ]

        max_attempts = 5
        last_error = "Worker spawn failed"

        for _ in range(max_attempts):
            grpc_port, ws_port = await asyncio.to_thread(self._allocator.allocate_pair)
            logger.info(
                "Allocated ports for session %s: grpc=%s ws=%s",
                request.session_id,
                grpc_port,
                ws_port,
            )
            try:
                record = await asyncio.to_thread(
                    self._docker.spawn_worker,
                    session_id=request.session_id,
                    session_token=request.session_token,
                    callback_address=request.callback_address or Config.CALLBACK_ADDRESS,
                    questions=questions,
                    grpc_port=grpc_port,
                    ws_port=ws_port,
                    timeout_seconds=request.timeout_seconds or Config.DEFAULT_TIMEOUT,
                )
                await self._registry.add(record)
                logger.info(
                    "Worker spawned: session_id=%s container_id=%s grpc_host=%s ws_host=%s",
                    request.session_id,
                    record.container_id,
                    record.grpc_host,
                    record.ws_host,
                )

                return manager_pb2.SpawnWorkerResponse(
                    success=True,
                    worker_grpc_host=record.grpc_host,
                    worker_ws_host=record.ws_host,
                    container_id=record.container_id,
                )

            except Exception as e:
                await asyncio.to_thread(self._allocator.release_pair, grpc_port, ws_port)
                message = str(e)
                last_error = message
                logger.warning(
                    "SpawnWorker failed: session_id=%s grpc=%s ws=%s error=%s",
                    request.session_id,
                    grpc_port,
                    ws_port,
                    message,
                )

                if "port is already allocated" in message.lower():
                    continue

                return manager_pb2.SpawnWorkerResponse(
                    success=False,
                    error_message=message,
                )

        return manager_pb2.SpawnWorkerResponse(
            success=False,
            error_message=f"Worker spawn failed after {max_attempts} retries: {last_error}",
        )

    async def TerminateWorker(self, request, context):
        logger.info("TerminateWorker requested: session_id=%s", request.session_id)
        record = await self._registry.get(request.session_id)
        if not record:
            logger.warning("TerminateWorker: no record found for session_id=%s", request.session_id)
            return manager_pb2.TerminateWorkerResponse(success=False)

        await asyncio.to_thread(
            self._docker.stop_worker, record.container_id
        )
        await self._registry.update_status(
            request.session_id, WorkerStatus.DEAD
        )
        await asyncio.to_thread(
            self._allocator.release_pair, record.grpc_port, record.ws_port
        )
        logger.info(
            "TerminateWorker completed: session_id=%s container_id=%s",
            request.session_id,
            record.container_id,
        )
        return manager_pb2.TerminateWorkerResponse(success=True)

    async def GetWorkerStatus(self, request, context):
        logger.debug("GetWorkerStatus requested: session_id=%s", request.session_id)
        record = await self._registry.get(request.session_id)
        if not record:
            logger.info("GetWorkerStatus: session_id=%s not found", request.session_id)
            return manager_pb2.GetWorkerStatusResponse(status="not_found")

        is_alive = await asyncio.to_thread(
            self._docker.is_running, record.container_id
        )
        if not is_alive and record.status == WorkerStatus.RUNNING:
            await self._registry.update_status(
                request.session_id, WorkerStatus.DEAD
            )
            record.status = WorkerStatus.DEAD
            logger.warning(
                "GetWorkerStatus: session_id=%s container_id=%s marked dead",
                request.session_id,
                record.container_id,
            )

        return manager_pb2.GetWorkerStatusResponse(
            status=record.status,
            container_id=record.container_id,
        )