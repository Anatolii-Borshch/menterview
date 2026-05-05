import socket
from app.config import Config

class PortAllocator:
    def __init__(self):
        self._used: set[int] = set()

    def allocate_pair(self) -> tuple[int, int]:
        grpc_port = self._find_free(exclude=self._used)
        ws_port   = self._find_free(exclude=self._used | {grpc_port})
        self._used.update([grpc_port, ws_port])
        return grpc_port, ws_port

    def release_pair(self, grpc_port: int, ws_port: int):
        self._used.discard(grpc_port)
        self._used.discard(ws_port)

    def _find_free(self, exclude: set[int]) -> int:
        for port in range(Config.PORT_RANGE_START, Config.PORT_RANGE_END):
            if port in exclude:
                continue
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                if s.connect_ex(("localhost", port)) != 0:
                    return port
        raise RuntimeError("No free ports available in range")