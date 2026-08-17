from dataclasses import dataclass, field
import random


@dataclass
class Process:
    pid: str
    arrival_time: int
    burst_time: int
    priority: int

    # Runtime values
    remaining_time: int = field(init=False)
    completion_time: int = 0
    waiting_time: int = 0
    turnaround_time: int = 0
    response_time: int = -1

    # UI
    color: str = ""

    def __post_init__(self):
        self.remaining_time = self.burst_time

        self.color = "#{:06x}".format(
            random.randint(0, 0xFFFFFF)
        )

    def reset(self):
        """Reset process before running another algorithm."""
        self.remaining_time = self.burst_time
        self.completion_time = 0
        self.waiting_time = 0
        self.turnaround_time = 0
        self.response_time = -1