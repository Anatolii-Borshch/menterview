import sys
sys.path.insert(0, '/app/generated')

import grpc
import logging
import manager_pb2_grpc
from app.grpc.servicer import ManagerServicer

logger = logging.getLogger(__name__)

async def serve_grpc(servicer: ManagerServicer, port: int):
    server = grpc.aio.server()
    manager_pb2_grpc.add_ManagerServiceServicer_to_server(servicer, server)
    server.add_insecure_port(f"[::]:{port}")
    await server.start()
    logger.info("Worker manager gRPC server running on port %s", port)
    await server.wait_for_termination()