import grpc
from app.grpc.servicer import SessionServicer
from app.session.manager import SessionManager
from generated import session_pb2_grpc

async def serve_grpc(manager: SessionManager, port: int):
    server = grpc.aio.server()
    session_pb2_grpc.add_SessionServiceServicer_to_server(
        SessionServicer(manager), server
    )
    server.add_insecure_port(f"[::]:{port}")
    await server.start()
    print(f"gRPC server running on port {port}")
    await server.wait_for_termination()