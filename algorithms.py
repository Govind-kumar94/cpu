from dataclasses import dataclass
from copy import deepcopy

from scheduler import ScheduleResult
from timeline import ExecutionBlock


# ==========================================================
# Helper
# ==========================================================

COLORS = [
    "#F44336",
    "#4CAF50",
    "#2196F3",
    "#FF9800",
    "#9C27B0",
    "#009688",
    "#3F51B5",
    "#795548",
    "#607D8B",
    "#E91E63",
]


def clone_processes(processes):

    cloned = deepcopy(processes)

    for i, p in enumerate(cloned):
        p.color = COLORS[i % len(COLORS)]
        p.remaining_time = p.burst_time
        p.response_time = -1
        p.waiting_time = 0
        p.turnaround_time = 0
        p.completion_time = 0

    return cloned


# ==========================================================
# FCFS
# ==========================================================

def fcfs(processes):

    processes = clone_processes(processes)

    processes.sort(key=lambda x: x.arrival_time)

    current_time = 0

    timeline = []

    for p in processes:

        if current_time < p.arrival_time:

            timeline.append(

                ExecutionBlock(
                    pid="IDLE",
                    start=current_time,
                    end=p.arrival_time,
                    color="#666666"
                )

            )

            current_time = p.arrival_time

        start = current_time

        if p.response_time == -1:
            p.response_time = start - p.arrival_time

        current_time += p.burst_time

        p.completion_time = current_time

        p.turnaround_time = (
            p.completion_time - p.arrival_time
        )

        p.waiting_time = (
            p.turnaround_time - p.burst_time
        )

        timeline.append(

            ExecutionBlock(

                pid=p.pid,

                start=start,

                end=current_time,

                color=p.color

            )

        )

    return ScheduleResult(
        processes=processes,
        timeline=timeline
    )


# ==========================================================
# SJF NON PREEMPTIVE
# ==========================================================

def sjf(processes):

    processes = clone_processes(processes)

    completed = 0

    n = len(processes)

    current_time = 0

    timeline = []

    visited = [False] * n

    while completed < n:

        available = []

        for i, p in enumerate(processes):

            if (
                not visited[i]
                and p.arrival_time <= current_time
            ):
                available.append((i, p))

        if not available:

            current_time += 1

            continue

        index, process = min(
            available,
            key=lambda x: x[1].burst_time
        )

        visited[index] = True

        start = current_time

        if process.response_time == -1:

            process.response_time = (
                start - process.arrival_time
            )

        current_time += process.burst_time

        process.completion_time = current_time

        process.turnaround_time = (
            current_time - process.arrival_time
        )

        process.waiting_time = (
            process.turnaround_time
            - process.burst_time
        )

        timeline.append(

            ExecutionBlock(

                pid=process.pid,

                start=start,

                end=current_time,

                color=process.color

            )

        )

        completed += 1

    return ScheduleResult(

        processes=processes,

        timeline=timeline

    )
# ==========================================================
# PRIORITY (NON-PREEMPTIVE)
# ==========================================================

def priority_scheduling(processes):

    processes = clone_processes(processes)

    completed = 0

    n = len(processes)

    current_time = 0

    timeline = []

    visited = [False] * n

    while completed < n:

        available = []

        for i, p in enumerate(processes):

            if (
                not visited[i]
                and p.arrival_time <= current_time
            ):
                available.append((i, p))

        if not available:

            current_time += 1

            continue

        index, process = min(
            available,
            key=lambda x: (
                x[1].priority,
                x[1].arrival_time
            )
        )

        visited[index] = True

        start = current_time

        if process.response_time == -1:

            process.response_time = (
                start - process.arrival_time
            )

        current_time += process.burst_time

        process.completion_time = current_time

        process.turnaround_time = (
            current_time - process.arrival_time
        )

        process.waiting_time = (
            process.turnaround_time
            - process.burst_time
        )

        timeline.append(

            ExecutionBlock(

                pid=process.pid,

                start=start,

                end=current_time,

                color=process.color

            )

        )

        completed += 1

    return ScheduleResult(

        processes=processes,

        timeline=timeline

    )


# ==========================================================
# ROUND ROBIN
# ==========================================================

def round_robin(processes, quantum):

    processes = clone_processes(processes)

    queue = []

    timeline = []

    current_time = 0

    completed = 0

    arrived = set()

    n = len(processes)

    while completed < n:

        for i, p in enumerate(processes):

            if (
                i not in arrived
                and p.arrival_time <= current_time
            ):
                queue.append(p)
                arrived.add(i)

        if not queue:

            current_time += 1
            continue

        process = queue.pop(0)

        if process.response_time == -1:

            process.response_time = (
                current_time
                - process.arrival_time
            )

        start = current_time

        run = min(
            quantum,
            process.remaining_time
        )

        current_time += run

        process.remaining_time -= run

        timeline.append(

            ExecutionBlock(

                pid=process.pid,

                start=start,

                end=current_time,

                color=process.color

            )

        )

        for i, p in enumerate(processes):

            if (
                i not in arrived
                and p.arrival_time <= current_time
            ):
                queue.append(p)
                arrived.add(i)

        if process.remaining_time > 0:

            queue.append(process)

        else:

            process.completion_time = current_time

            process.turnaround_time = (

                current_time

                - process.arrival_time

            )

            process.waiting_time = (

                process.turnaround_time

                - process.burst_time

            )

            completed += 1

    return ScheduleResult(

        processes=processes,

        timeline=timeline

    )
# ==========================================================
# SJF PREEMPTIVE (SRTF)
# ==========================================================

def sjf_preemptive(processes):

    processes = clone_processes(processes)

    timeline = []

    current_time = 0

    completed = 0

    n = len(processes)

    current_process = None

    block_start = 0

    while completed < n:

        available = [

            p for p in processes

            if p.arrival_time <= current_time

            and p.remaining_time > 0

        ]

        if not available:

            current_time += 1

            continue

        process = min(

            available,

            key=lambda p: p.remaining_time

        )

        if current_process != process:

            if current_process is not None:

                timeline.append(

                    ExecutionBlock(

                        pid=current_process.pid,

                        start=block_start,

                        end=current_time,

                        color=current_process.color

                    )

                )

            current_process = process

            block_start = current_time

        if process.response_time == -1:

            process.response_time = (

                current_time

                - process.arrival_time

            )

        process.remaining_time -= 1

        current_time += 1

        if process.remaining_time == 0:

            process.completion_time = current_time

            process.turnaround_time = (

                current_time

                - process.arrival_time

            )

            process.waiting_time = (

                process.turnaround_time

                - process.burst_time

            )

            completed += 1

    if current_process is not None:

        timeline.append(

            ExecutionBlock(

                pid=current_process.pid,

                start=block_start,

                end=current_time,

                color=current_process.color

            )

        )

    return ScheduleResult(

        processes=processes,

        timeline=timeline

    )


# ==========================================================
# PRIORITY PREEMPTIVE
# ==========================================================

def priority_preemptive(processes):

    processes = clone_processes(processes)

    timeline = []

    current_time = 0

    completed = 0

    n = len(processes)

    current_process = None

    block_start = 0

    while completed < n:

        available = [

            p for p in processes

            if p.arrival_time <= current_time

            and p.remaining_time > 0

        ]

        if not available:

            current_time += 1

            continue

        process = min(

            available,

            key=lambda p: (

                p.priority,

                p.arrival_time

            )

        )

        if current_process != process:

            if current_process is not None:

                timeline.append(

                    ExecutionBlock(

                        pid=current_process.pid,

                        start=block_start,

                        end=current_time,

                        color=current_process.color

                    )

                )

            current_process = process

            block_start = current_time

        if process.response_time == -1:

            process.response_time = (

                current_time

                - process.arrival_time

            )

        process.remaining_time -= 1

        current_time += 1

        if process.remaining_time == 0:

            process.completion_time = current_time

            process.turnaround_time = (

                current_time

                - process.arrival_time

            )

            process.waiting_time = (

                process.turnaround_time

                - process.burst_time

            )

            completed += 1

    if current_process is not None:

        timeline.append(

            ExecutionBlock(

                pid=current_process.pid,

                start=block_start,

                end=current_time,

                color=current_process.color

            )

        )

    return ScheduleResult(

        processes=processes,

        timeline=timeline

    )


# ==========================================================
# MAIN ENTRY POINT
# ==========================================================

def run_algorithm(name, processes, quantum=2):

    if name == "FCFS":
        return fcfs(processes)

    elif name == "SJF":
        return sjf(processes)

    elif name == "SJF Preemptive":
        return sjf_preemptive(processes)

    elif name == "Priority":
        return priority_scheduling(processes)

    elif name == "Priority Preemptive":
        return priority_preemptive(processes)

    elif name == "Round Robin":
        return round_robin(processes, quantum)

    raise ValueError(f"Unknown Algorithm : {name}")