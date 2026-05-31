import grpc
import logging
from app.grpc.servicer import SessionServicer
from app.session.manager import SessionManager
from generated import session_pb2_grpc


logger = logging.getLogger(__name__)

async def serve_grpc(manager: SessionManager, port: int):
    server = grpc.aio.server()
    session_pb2_grpc.add_SessionServiceServicer_to_server(
        SessionServicer(manager), server
    )
    server.add_insecure_port(f"[::]:{port}")
    await server.start()
    logger.info("Worker gRPC server running on port %s", port)
    await server.wait_for_termination()