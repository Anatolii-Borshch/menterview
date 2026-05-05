import asyncio

import websockets
from app.websocket.handler import SessionHandler

async def serve_websocket(handler: SessionHandler, port: int):
    async with websockets.serve(handler.handle, "0.0.0.0", port):
        print(f"WebSocket server running on port {port}")
        await asyncio.Future()