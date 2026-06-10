import asyncio
import logging

import websockets
from app.websocket.handler import SessionHandler

logger = logging.getLogger(__name__)

async def serve_websocket(handler: SessionHandler, port: int):
    try:
        async with websockets.serve(handler.handle, "0.0.0.0", port):
            logger.info("Worker WebSocket server running on port %s", port)
            await asyncio.Future()
    except Exception:
        logger.exception("Worker WebSocket server failed on port %s", port)
        raise