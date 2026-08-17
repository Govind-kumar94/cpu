from copy import deepcopy

from algorithms import (
    fcfs,
    sjf,
    sjf_preemptive,
    priority_scheduling,
    priority_preemptive,
    round_robin,
)


class ComparisonEngine:

    def __init__(self):

        self.algorithms = {

            "FCFS": lambda p, q: fcfs(p),

            "SJF": lambda p, q: sjf(p),

            "SJF Preemptive": lambda p, q: sjf_preemptive(p),

            "Priority": lambda p, q: priority_scheduling(p),

            "Priority Preemptive": lambda p, q: priority_preemptive(p),

            "Round Robin": lambda p, q: round_robin(p, q)

        }

    # ----------------------------------------------------

    def compare(self, processes, quantum=2):

        results = {}

        for name, algorithm in self.algorithms.items():

            copied = deepcopy(processes)

            result = algorithm(copied, quantum)

            results[name] = {

                "waiting": result.average_waiting,

                "turnaround": result.average_turnaround,

                "response": result.average_response,

                "cpu": result.cpu_utilization,

                "throughput": result.throughput,

                "finish": result.finish_time

            }

        return results

    # ----------------------------------------------------

    def best_algorithm(self, results):

        if not results:

            return None

        best = min(

            results,

            key=lambda x: results[x]["waiting"]

        )

        return best

    # ----------------------------------------------------

    def print_report(self, results):

        print("\n========== Comparison ==========\n")

        for algo, data in results.items():

            print(f"{algo}")

            print(f"Waiting Time     : {data['waiting']:.2f}")

            print(f"Turnaround Time : {data['turnaround']:.2f}")

            print(f"Response Time   : {data['response']:.2f}")

            print(f"CPU Utilization : {data['cpu']:.2f}%")

            print(f"Throughput      : {data['throughput']:.2f}")

            print()

        best = self.best_algorithm(results)

        print(f"Best Algorithm : {best}")