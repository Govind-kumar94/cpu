from matplotlib.backends.backend_qtagg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure


class ComparisonChart(FigureCanvas):

    def __init__(self):

        self.figure = Figure(figsize=(6, 4))

        super().__init__(self.figure)

        self.axes = self.figure.add_subplot(111)

        self.figure.set_facecolor("#202124")

        self.axes.set_facecolor("#2b2b2b")

        self.axes.tick_params(colors="white")

        self.axes.spines["bottom"].set_color("white")
        self.axes.spines["left"].set_color("white")
        self.axes.spines["top"].set_color("white")
        self.axes.spines["right"].set_color("white")

        self.axes.set_title(
            "Algorithm Comparison",
            color="white",
            fontsize=12,
            weight="bold"
        )

    # --------------------------------------------------

    def clear(self):

        self.axes.clear()

        self.axes.set_facecolor("#2b2b2b")

        self.axes.tick_params(colors="white")

        self.axes.spines["bottom"].set_color("white")
        self.axes.spines["left"].set_color("white")
        self.axes.spines["top"].set_color("white")
        self.axes.spines["right"].set_color("white")

        self.axes.set_title(
            "Algorithm Comparison",
            color="white",
            fontsize=12,
            weight="bold"
        )

    # --------------------------------------------------

    def plot(self, results):

        self.clear()

        algorithms = list(results.keys())

        waiting = [
            results[a]["waiting"]
            for a in algorithms
        ]

        bars = self.axes.bar(

            algorithms,

            waiting,

            color=[
                "#42A5F5",
                "#66BB6A",
                "#FFA726",
                "#AB47BC",
                "#EF5350",
                "#26C6DA"
            ]

        )

        self.axes.set_ylabel(
            "Average Waiting Time",
            color="white"
        )

        self.axes.tick_params(

            axis="x",

            rotation=15,

            colors="white"

        )

        self.axes.tick_params(

            axis="y",

            colors="white"

        )

        for bar in bars:

            height = bar.get_height()

            self.axes.text(

                bar.get_x() + bar.get_width() / 2,

                height + 0.1,

                f"{height:.2f}",

                ha="center",

                color="white",

                fontsize=9

            )

        self.figure.tight_layout()

        self.draw()

    # --------------------------------------------------

    def plot_turnaround(self, results):

        self.clear()

        algorithms = list(results.keys())

        values = [

            results[a]["turnaround"]

            for a in algorithms

        ]

        bars = self.axes.bar(

            algorithms,

            values,

            color="#4CAF50"

        )

        self.axes.set_ylabel(

            "Average Turnaround",

            color="white"

        )

        for bar in bars:

            self.axes.text(

                bar.get_x()+bar.get_width()/2,

                bar.get_height()+0.1,

                f"{bar.get_height():.2f}",

                ha="center",

                color="white"

            )

        self.figure.tight_layout()

        self.draw()

    # --------------------------------------------------

    def plot_response(self, results):

        self.clear()

        algorithms = list(results.keys())

        values = [

            results[a]["response"]

            for a in algorithms

        ]

        bars = self.axes.bar(

            algorithms,

            values,

            color="#FF9800"

        )

        self.axes.set_ylabel(

            "Average Response",

            color="white"

        )

        for bar in bars:

            self.axes.text(

                bar.get_x()+bar.get_width()/2,

                bar.get_height()+0.1,

                f"{bar.get_height():.2f}",

                ha="center",

                color="white"

            )

        self.figure.tight_layout()

        self.draw()

    # --------------------------------------------------

    def plot_cpu(self, results):

        self.clear()

        algorithms = list(results.keys())

        values = [

            results[a]["cpu"]

            for a in algorithms

        ]

        bars = self.axes.bar(

            algorithms,

            values,

            color="#E91E63"

        )

        self.axes.set_ylabel(

            "CPU Utilization (%)",

            color="white"

        )

        self.axes.set_ylim(0,100)

        for bar in bars:

            self.axes.text(

                bar.get_x()+bar.get_width()/2,

                bar.get_height()+1,

                f"{bar.get_height():.1f}%",

                ha="center",

                color="white"

            )

        self.figure.tight_layout()

        self.draw()

    # --------------------------------------------------

    def plot_throughput(self, results):

        self.clear()

        algorithms = list(results.keys())

        values = [

            results[a]["throughput"]

            for a in algorithms

        ]

        bars = self.axes.bar(

            algorithms,

            values,

            color="#26A69A"

        )

        self.axes.set_ylabel(

            "Throughput",

            color="white"

        )

        for bar in bars:

            self.axes.text(

                bar.get_x()+bar.get_width()/2,

                bar.get_height()+0.01,

                f"{bar.get_height():.2f}",

                ha="center",

                color="white"

            )

        self.figure.tight_layout()

        self.draw()