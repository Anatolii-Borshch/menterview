import asyncio
from datetime import datetime
from app.registry.registry import ContainerRegistry
from app.registry.models import WorkerStatus
from app.docker.client import DockerManager
from app.docker.port_allocator import PortAllocator

class Reaper:
    def __init__(
        self,
        registry:  ContainerRegistry,
        docker:    DockerManager,
        allocator: PortAllocator,
    ):
        self._registry  = registry
        self._docker    = docker
        self._allocator = allocator

    async def run(self, interval_seconds: int = 30):
        while True:
            await asyncio.sleep(interval_seconds)
            await self._sweep()

    async def _sweep(self):
        now     = datetime.utcnow()
        records = await self._registry.get_all()

        for record in records:
            if record.status != WorkerStatus.RUNNING:
                continue

            if now >= record.timeout_at:
                print(f"Reaper: killing timed-out worker for session {record.session_id}")
                await asyncio.to_thread(
                    self._docker.stop_worker, record.container_id
                )
                await self._registry.update_status(
                    record.session_id, WorkerStatus.DEAD
                )
                await asyncio.to_thread(
                    self._allocator.release_pair, record.grpc_port, record.ws_port
                )
                continue

            is_alive = await asyncio.to_thread(
                self._docker.is_running, record.container_id
            )
            if not is_alive:
                print(f"Reaper: worker for session {record.session_id} died unexpectedly")
                await self._registry.update_status(
                    record.session_id, WorkerStatus.DEAD
                )
                await asyncio.to_thread(
                    self._allocator.release_pair, record.grpc_port, record.ws_port
                )