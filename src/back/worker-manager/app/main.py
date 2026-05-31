import asyncio
import logging
import signal
from contextlib import suppress
from app.config import Config
from app.docker.client import DockerManager
from app.docker.port_allocator import PortAllocator
from app.registry.registry import ContainerRegistry
from app.reaper.reaper import Reaper
from app.grpc.server import serve_grpc
from app.grpc.servicer import ManagerServicer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

async def main():
    docker    = DockerManager()
    allocator = PortAllocator()
    registry  = ContainerRegistry()
    reaper    = Reaper(registry, docker, allocator)
    servicer  = ManagerServicer(docker, allocator, registry)

    logger.info("Worker manager starting on port %s", Config.GRPC_PORT)
    logger.info("Worker image: %s", Config.WORKER_IMAGE)
    logger.info("Port range: %s-%s", Config.PORT_RANGE_START, Config.PORT_RANGE_END)

    stop_event = asyncio.Event()

    def _request_shutdown(sig_name: str):
        logger.info("Shutdown signal received: %s", sig_name)
        stop_event.set()

    loop = asyncio.get_running_loop()
    for sig in (signal.SIGTERM, signal.SIGINT):
        with suppress(NotImplementedError):
            loop.add_signal_handler(sig, _request_shutdown, sig.name)

    if Config.CLEANUP_ON_STARTUP:
        cleaned = await asyncio.to_thread(
            docker.cleanup_session_workers,
            Config.SESSION_CONTAINER_PREFIX,
        )
        logger.info("Startup cleanup removed %s worker container(s)", cleaned)

    grpc_task = asyncio.create_task(serve_grpc(servicer, port=Config.GRPC_PORT))
    reaper_task = asyncio.create_task(reaper.run(interval_seconds=30))

    try:
        await stop_event.wait()
    finally:
        logger.info("Stopping manager background tasks...")
        for task in (grpc_task, reaper_task):
            task.cancel()
        with suppress(asyncio.CancelledError):
            await asyncio.gather(grpc_task, reaper_task)

        if Config.CLEANUP_ON_SHUTDOWN:
            cleaned = await asyncio.to_thread(
                docker.cleanup_session_workers,
                Config.SESSION_CONTAINER_PREFIX,
            )
            logger.info("Shutdown cleanup removed %s worker container(s)", cleaned)

if __name__ == "__main__":
    asyncio.run(main())