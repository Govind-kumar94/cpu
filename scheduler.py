from dataclasses import dataclass, field


@dataclass
class ScheduleResult:
    """
    Stores complete scheduling result.

    Returned by every scheduling algorithm.
    """

    processes: list
    timeline: list

    average_waiting: float = 0.0
    average_turnaround: float = 0.0
    average_response: float = 0.0

    cpu_utilization: float = 0.0

    throughput: float = 0.0

    finish_time: int = 0

    idle_time: int = 0

    def __post_init__(self):

        if not self.processes:
            return

        n = len(self.processes)

        self.average_waiting = (
            sum(p.waiting_time for p in self.processes) / n
        )

        self.average_turnaround = (
            sum(p.turnaround_time for p in self.processes) / n
        )

        self.average_response = (
            sum(p.response_time for p in self.processes) / n
        )

        self.finish_time = max(
            p.completion_time for p in self.processes
        )

        total_burst = sum(
            p.burst_time for p in self.processes
        )

        self.idle_time = max(
            0,
            self.finish_time - total_burst
        )

        if self.finish_time > 0:

            self.cpu_utilization = (
                total_burst / self.finish_time
            ) * 100

            self.throughput = (
                n / self.finish_time
            )

        else:

            self.cpu_utilization = 0

            self.throughput = 0