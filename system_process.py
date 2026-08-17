import psutil
import time


class SystemProcessLoader:

    def load_processes(self, limit=20):

        processes = []

        now = time.time()

        for p in psutil.process_iter([
            "pid",
            "name",
            "cpu_times",
            "nice",
            "create_time"
        ]):

            try:

                info = p.info

                # -----------------------------
                # Skip unnamed processes
                # -----------------------------
                if not info.get("name"):
                    continue

                # -----------------------------
                # Unique Process Name
                # -----------------------------
                pid = f'{info["name"]} ({info["pid"]})'

                # -----------------------------
                # Burst Time
                # -----------------------------
                cpu = info.get("cpu_times")

                if cpu is not None:
                    cpu_used = (cpu.user or 0) + (cpu.system or 0)
                else:
                    cpu_used = 0.1

                burst = max(1, int(cpu_used * 10))

                # Keep burst reasonable
                if burst > 100:
                    burst = 100

                # -----------------------------
                # Arrival Time
                # -----------------------------
                create_time = info.get("create_time")

                if create_time is not None:
                    age = max(0, int(now - create_time))
                    arrival = age % 20
                else:
                    arrival = 0

                # -----------------------------
                # Priority
                # -----------------------------
                priority = info.get("nice")

                try:
                    if priority is None:
                        priority = 5

                    priority = int(priority)

                except Exception:
                    priority = 5

                # Convert Windows priorities into 1-10 range
                if priority < 1:
                    priority = 1

                if priority > 10:
                    priority = 10

                # -----------------------------
                # Save Process
                # -----------------------------
                processes.append({

                    "pid": pid,

                    "arrival": arrival,

                    "burst": burst,

                    "priority": priority

                })

            except (
                psutil.NoSuchProcess,
                psutil.AccessDenied,
                psutil.ZombieProcess,
                KeyError,
                TypeError,
                ValueError,
            ):
                continue

        # -----------------------------
        # Sort Processes
        # -----------------------------
        processes.sort(
            key=lambda p: (
                p["arrival"],
                p["burst"]
            )
        )

        return processes[:limit]