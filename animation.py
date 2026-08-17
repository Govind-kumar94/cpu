from PyQt6.QtCore import QObject, QTimer


class AnimationEngine(QObject):

    def __init__(self, gantt):

        super().__init__()

        self.gantt = gantt

        self.window = None

        self.timeline = []

        self.index = 0

        self.speed = 5

        self.paused = False

        self.timer = QTimer()

        self.timer.timeout.connect(self.next_step)

    # -------------------------------------------------

    def set_speed(self, value):
        """Update animation speed from slider (1-10)."""
        self.speed = value

        if self.timer.isActive():
            interval = max(50, 1100 - value * 100)
            self.timer.setInterval(interval)

    # -------------------------------------------------

    def start(self, timeline, speed=None):

        if not timeline:
            return

    # Update speed if provided from GUI
        if speed is not None:
            self.speed = speed

        self.timeline = timeline

        self.index = 0

        self.paused = False

        self.gantt.set_timeline(timeline)

        interval = max(50, 1100 - self.speed * 100)

        self.timer.start(interval)
    # -------------------------------------------------

    def next_step(self):

        if self.paused:
            return

        if self.index >= len(self.timeline):

            self.timer.stop()

            if self.window:
                self.window.progress.setValue(100)

            return

        block = self.timeline[self.index]

        self.gantt.set_current_block(self.index)

        if self.window:

            total = self.timeline[-1].end

            self.window.update_progress(

                block.end,

                total,

                block.pid

            )

        self.index += 1

    # -------------------------------------------------

    def pause(self):

        self.paused = True

    # -------------------------------------------------

    def resume(self):

        self.paused = False

    # -------------------------------------------------

    def stop(self):

        self.timer.stop()

        self.paused = False

    # -------------------------------------------------

    def reset(self):

        self.stop()

        self.index = 0

        self.timeline = []

        self.gantt.clear_chart()

        if self.window:

            self.window.progress.setValue(0)

            self.window.current_process_label.setText(
                "Current Process : -"
            )

            self.window.current_time_label.setText(
                "Current Time : 0"
            )

    # -------------------------------------------------

    def is_running(self):

        return self.timer.isActive()

    # -------------------------------------------------

    def current_process(self):

        if (
            0 <= self.index < len(self.timeline)
        ):
            return self.timeline[self.index]

        return None