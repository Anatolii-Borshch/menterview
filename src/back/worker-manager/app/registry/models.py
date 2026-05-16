from dataclasses import dataclass
from datetime import datetime
from enum import Enum

class WorkerStatus(str, Enum):
    RUNNING  = "running"
    FINISHED = "finished"
    DEAD     = "dead"

@dataclass
class ContainerRecord:
    session_id:   int
    container_id: str
    grpc_host:    str
    ws_host:      str
    grpc_port:    int
    ws_port:      int
    status:       WorkerStatus
    spawned_at:   datetime
    timeout_at:   datetime