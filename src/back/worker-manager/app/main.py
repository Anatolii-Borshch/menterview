import asyncio
from app.config import Config
from app.docker.client import DockerManager
from app.docker.port_allocator import PortAllocator
from app.registry.registry import ContainerRegistry
from app.reaper.reaper import Reaper
from app.grpc.server import serve_grpc
from app.grpc.servicer import ManagerServicer

async def main():
    docker    = DockerManager()
    allocator = PortAllocator()
    registry  = ContainerRegistry()
    reaper    = Reaper(registry, docker)
    servicer  = ManagerServicer(docker, allocator, registry)

    print(f"Worker manager starting on port {Config.GRPC_PORT}")
    print(f"Worker image: {Config.WORKER_IMAGE}")
    print(f"Port range: {Config.PORT_RANGE_START}-{Config.PORT_RANGE_END}")

    await asyncio.gather(
        serve_grpc(servicer, port=Config.GRPC_PORT),
        reaper.run(interval_seconds=30),
    )

if __name__ == "__main__":
    asyncio.run(main())