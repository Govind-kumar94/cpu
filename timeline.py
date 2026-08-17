from dataclasses import dataclass


@dataclass
class ExecutionBlock:
    pid: str
    start: int
    end: int
    color: str