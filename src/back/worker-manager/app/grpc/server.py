import sys
sys.path.insert(0, '/app/generated')

import grpc
import manager_pb2_grpc
from app.grpc.servicer import ManagerServicer

async def serve_grpc(servicer: ManagerServicer, port: int):
    server = grpc.aio.server()
    manager_pb2_grpc.add_ManagerServiceServicer_to_server(servicer, server)
    server.add_insecure_port(f"[::]:{port}")
    await server.start()
    print(f"Worker manager gRPC server running on port {port}")
    await server.wait_for_termination()