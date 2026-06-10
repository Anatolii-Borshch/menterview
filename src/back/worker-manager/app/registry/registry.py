import asyncio
from typing import Optional
from app.registry.models import ContainerRecord, WorkerStatus

class ContainerRegistry:
    def __init__(self):
        self._store: dict[int, ContainerRecord] = {}
        self._lock = asyncio.Lock()

    async def add(self, record: ContainerRecord):
        async with self._lock:
            self._store[record.session_id] = record

    async def get(self, session_id: int) -> Optional[ContainerRecord]:
        async with self._lock:
            return self._store.get(session_id)

    async def update_status(self, session_id: int, status: WorkerStatus):
        async with self._lock:
            if session_id in self._store:
                self._store[session_id].status = status

    async def remove(self, session_id: int):
        async with self._lock:
            self._store.pop(session_id, None)

    async def get_all(self) -> list[ContainerRecord]:
        async with self._lock:
            return list(self._store.values())