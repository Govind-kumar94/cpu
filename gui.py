import random

from PyQt6.QtCore import Qt
from PyQt6.QtGui import QAction, QFont, QKeySequence
from PyQt6.QtWidgets import (
    QMainWindow,
    QWidget,
    QLabel,
    QPushButton,
    QVBoxLayout,
    QHBoxLayout,
    QGridLayout,
    QGroupBox,
    QSplitter,
    QTableWidget,
    QTableWidgetItem,
    QComboBox,
    QSpinBox,
    QSlider,
    QProgressBar,
    QMessageBox,
    QStatusBar,
    QToolBar,
    QHeaderView,
    QSizePolicy,
    QFileDialog,
)

from process import Process
from algorithms import run_algorithm
from gantt import GanttChart
from animation import AnimationEngine
from comparison import ComparisonEngine
from charts import ComparisonChart
from system_process import SystemProcessLoader
from importer import Importer
from exporter import Exporter
from theme import ThemeManager


class MainWindow(QMainWindow):

    def __init__(self):
        super().__init__()

        self.setWindowTitle("CPU Scheduler Pro")
        self.resize(1500, 900)
        self.setMinimumSize(1200, 700)

        self.create_menu()
        self.create_toolbar()
        self.create_statusbar()
        self.create_ui()

        ThemeManager.apply(self, "dark")

        self.run_action.setShortcut(
            QKeySequence("Ctrl+R")
        )

        self.compare_action.setShortcut(
            QKeySequence("Ctrl+Shift+C")
        )

    # ------------------------------------------------

    def create_menu(self):

        menubar = self.menuBar()

        file_menu = menubar.addMenu("File")
        view_menu = menubar.addMenu("View")
        help_menu = menubar.addMenu("Help")

        self.import_action = QAction("Import", self)
        self.export_action = QAction("Export", self)
        self.exit_action = QAction("Exit", self)
        self.about_action = QAction("About", self)

        self.dark_action = QAction("Dark Theme", self)
        self.light_action = QAction("Light Theme", self)

        self.import_action.triggered.connect(
            self.import_file
        )

        self.export_action.triggered.connect(
            self.export_file
        )

        self.exit_action.triggered.connect(
            self.close
        )

        self.about_action.triggered.connect(
            self.show_about
        )

        self.dark_action.triggered.connect(
            lambda: ThemeManager.apply(self, "dark")
        )

        self.light_action.triggered.connect(
            lambda: ThemeManager.apply(self, "light")
        )

        file_menu.addAction(self.import_action)
        file_menu.addAction(self.export_action)
        file_menu.addSeparator()
        file_menu.addAction(self.exit_action)

        view_menu.addAction(self.dark_action)
        view_menu.addAction(self.light_action)

        help_menu.addAction(self.about_action)

    # ------------------------------------------------

    def create_toolbar(self):

        toolbar = QToolBar()
        toolbar.setMovable(False)

        self.addToolBar(toolbar)

        self.run_action = toolbar.addAction("▶ Run")
        self.pause_action = toolbar.addAction("⏸ Pause")
        self.reset_action = toolbar.addAction("⏹ Reset")

        toolbar.addSeparator()

        self.compare_action = toolbar.addAction(
            "📊 Compare"
        )

        toolbar.addSeparator()

        self.toolbar_import = toolbar.addAction(
            "📂 Import"
        )

        self.toolbar_export = toolbar.addAction(
            "💾 Export"
        )

        self.run_action.triggered.connect(
            self.test_processes
        )

        self.pause_action.triggered.connect(
            self.pause_animation
        )

        self.reset_action.triggered.connect(
            self.reset_animation
        )

        self.compare_action.triggered.connect(
            self.compare_algorithms
        )

        self.toolbar_import.triggered.connect(
            self.import_file
        )

        self.toolbar_export.triggered.connect(
            self.export_file
        )

    # ------------------------------------------------

    def create_statusbar(self):

        status = QStatusBar()
        status.showMessage("Ready")

        self.setStatusBar(status)

        # ------------------------------------------------

    def create_ui(self):

        central = QWidget()
        self.setCentralWidget(central)

        main_layout = QVBoxLayout()

        splitter = QSplitter()

        left = QWidget()
        right = QWidget()

        left_layout = QVBoxLayout()
        right_layout = QVBoxLayout()

        left.setLayout(left_layout)
        right.setLayout(right_layout)

        splitter.addWidget(left)
        splitter.addWidget(right)

        splitter.setStretchFactor(0, 3)
        splitter.setStretchFactor(1, 2)

        # ============================================
        # TITLE
        # ============================================

        title = QLabel("CPU Scheduler Pro")

        title.setAlignment(
            Qt.AlignmentFlag.AlignCenter
        )

        title.setFont(
            QFont(
                "Segoe UI",
                22,
                QFont.Weight.Bold
            )
        )

        left_layout.addWidget(title)

        # ============================================
        # CONTROL PANEL
        # ============================================

        control_box = QGroupBox("Scheduling Controls")

        control_layout = QGridLayout()

        self.algorithm_combo = QComboBox()

        self.algorithm_combo.addItems([

            "FCFS",

            "SJF",

            "SJF Preemptive",

            "Priority",

            "Priority Preemptive",

            "Round Robin"

        ])

        self.algorithm_combo.currentIndexChanged.connect(
            self.algorithm_changed
        )

        self.quantum_box = QSpinBox()

        self.quantum_box.setMinimum(1)

        self.quantum_box.setMaximum(100)

        self.quantum_box.setValue(2)

        self.speed_slider = QSlider(
            Qt.Orientation.Horizontal
        )

        self.speed_slider.setRange(1, 10)

        self.speed_slider.setValue(5)

        self.speed_slider.valueChanged.connect(
            self.animator_speed_changed
        )

        control_layout.addWidget(
            QLabel("Algorithm"),
            0,
            0
        )

        control_layout.addWidget(
            self.algorithm_combo,
            0,
            1
        )

        control_layout.addWidget(
            QLabel("Quantum"),
            0,
            2
        )

        control_layout.addWidget(
            self.quantum_box,
            0,
            3
        )

        control_layout.addWidget(
            QLabel("Animation Speed"),
            1,
            0
        )

        control_layout.addWidget(
            self.speed_slider,
            1,
            1,
            1,
            3
        )

        control_box.setLayout(control_layout)

        left_layout.addWidget(control_box)

        # ============================================
        # PROCESS TABLE
        # ============================================

        self.table = QTableWidget()

        self.table.setColumnCount(7)

        self.table.setHorizontalHeaderLabels([

            "PID",

            "Arrival",

            "Burst",

            "Priority",

            "CT",

            "WT",

            "TAT"

        ])

        self.table.horizontalHeader().setSectionResizeMode(

            QHeaderView.ResizeMode.Stretch

        )

        self.table.verticalHeader().setVisible(False)

        self.table.setAlternatingRowColors(True)

        self.table.setSelectionBehavior(

            QTableWidget.SelectionBehavior.SelectRows

        )

        self.table.setSizePolicy(

            QSizePolicy.Policy.Expanding,

            QSizePolicy.Policy.Expanding

        )

        left_layout.addWidget(self.table)

        # ============================================
        # PROCESS BUTTONS
        # ============================================

        process_buttons = QHBoxLayout()

        self.add_btn = QPushButton("➕ Add")

        self.delete_btn = QPushButton("➖ Delete")

        self.clear_btn = QPushButton("🗑 Clear")

        self.random_btn = QPushButton("🎲 Random")

        self.system_btn = QPushButton("🖥 Load System")

        process_buttons.addWidget(self.add_btn)

        process_buttons.addWidget(self.delete_btn)

        process_buttons.addWidget(self.clear_btn)

        process_buttons.addWidget(self.random_btn)

        process_buttons.addWidget(self.system_btn)

        left_layout.addLayout(process_buttons)

                # ============================================
        # RUN BUTTONS
        # ============================================

        run_buttons = QHBoxLayout()

        self.run_btn = QPushButton("▶ Run")
        self.pause_btn = QPushButton("⏸ Pause")
        self.reset_btn = QPushButton("⏹ Reset")
        self.compare_btn = QPushButton("📊 Compare")

        run_buttons.addWidget(self.run_btn)
        run_buttons.addWidget(self.pause_btn)
        run_buttons.addWidget(self.reset_btn)
        run_buttons.addWidget(self.compare_btn)

        left_layout.addLayout(run_buttons)

        # ============================================
        # GANTT CHART
        # ============================================
        

        from PyQt6.QtWidgets import QScrollArea

        gantt_box = QGroupBox("Gantt Chart")

        gantt_layout = QVBoxLayout()

        self.gantt = GanttChart()

        self.animator = AnimationEngine(self.gantt)
        self.animator.window = self

        # Scroll Area
        self.gantt_scroll = QScrollArea()

        self.gantt_scroll.setWidget(self.gantt)

        # Keep original size behavior
        self.gantt_scroll.setWidgetResizable(True)

        self.gantt_scroll.setHorizontalScrollBarPolicy(
            Qt.ScrollBarPolicy.ScrollBarAsNeeded
        )

        self.gantt_scroll.setVerticalScrollBarPolicy(
            Qt.ScrollBarPolicy.ScrollBarAlwaysOff
        )

        self.gantt_scroll.setFrameShape(QScrollArea.Shape.NoFrame)

        # IMPORTANT: fixed height
        self.gantt_scroll.setMinimumHeight(240)
        self.gantt_scroll.setMaximumHeight(260)

        gantt_layout.addWidget(self.gantt_scroll)

        gantt_box.setLayout(gantt_layout)

        left_layout.addWidget(gantt_box)

        

        # ============================================
        # RIGHT PANEL
        # ============================================

        stats_box = QGroupBox("Simulation Statistics")

        stats_layout = QGridLayout()

        self.algorithm_label = QLabel("Algorithm : -")

        self.current_process_label = QLabel(
            "Current Process : -"
        )

        self.current_time_label = QLabel(
            "Current Time : 0"
        )

        self.completed_label = QLabel(
            "Completed : 0"
        )

        self.avg_waiting_label = QLabel(
            "Average Waiting : 0"
        )

        self.avg_turnaround_label = QLabel(
            "Average Turnaround : 0"
        )

        self.cpu_label = QLabel(
            "CPU Utilization : 0%"
        )

        stats_layout.addWidget(
            self.algorithm_label,
            0,
            0
        )

        stats_layout.addWidget(
            self.current_process_label,
            1,
            0
        )

        stats_layout.addWidget(
            self.current_time_label,
            2,
            0
        )

        stats_layout.addWidget(
            self.completed_label,
            3,
            0
        )

        stats_layout.addWidget(
            self.avg_waiting_label,
            4,
            0
        )

        stats_layout.addWidget(
            self.avg_turnaround_label,
            5,
            0
        )

        stats_layout.addWidget(
            self.cpu_label,
            6,
            0
        )

        stats_box.setLayout(stats_layout)

        right_layout.addWidget(stats_box)

        # ============================================
        # PROGRESS BAR
        # ============================================

        progress_box = QGroupBox(
            "Execution Progress"
        )

        progress_layout = QVBoxLayout()

        self.progress = QProgressBar()

        self.progress.setRange(0, 100)

        self.progress.setValue(0)

        progress_layout.addWidget(self.progress)

        progress_box.setLayout(progress_layout)

        right_layout.addWidget(progress_box)

        # ============================================
        # COMPARISON CHART
        # ============================================

        chart_box = QGroupBox(
            "Algorithm Comparison"
        )

        chart_layout = QVBoxLayout()

        self.chart = ComparisonChart()

        chart_layout.addWidget(self.chart)

        chart_box.setLayout(chart_layout)

        right_layout.addWidget(chart_box)

        self.comparison = ComparisonEngine()

        # ============================================
        # FINISH LAYOUT
        # ============================================

        main_layout.addWidget(splitter)

        central.setLayout(main_layout)

        # ============================================
        # SIGNALS
        # ============================================

        self.add_btn.clicked.connect(
            self.add_process
        )

        self.delete_btn.clicked.connect(
            self.delete_process
        )

        self.clear_btn.clicked.connect(
            self.clear_processes
        )

        self.random_btn.clicked.connect(
            self.generate_random_processes
        )

        self.system_btn.clicked.connect(
            self.load_system_processes
        )

        self.run_btn.clicked.connect(
            self.test_processes
        )

        self.pause_btn.clicked.connect(
            self.pause_animation
        )

        self.reset_btn.clicked.connect(
            self.reset_animation
        )

        self.compare_btn.clicked.connect(
            self.compare_algorithms
        )

        self.algorithm_changed()

        # ============================================
    # ALGORITHM CHANGED
    # ============================================

    def algorithm_changed(self):

        rr = (
            self.algorithm_combo.currentText()
            == "Round Robin"
        )

        self.quantum_box.setEnabled(rr)

    # ============================================
    # ANIMATION SPEED
    # ============================================

    def animator_speed_changed(self, value):

        try:
            self.animator.set_speed(value)

        except Exception:
            pass

    # ============================================
    # IMPORT FILE
    # ============================================

    def import_file(self):

        filename, _ = QFileDialog.getOpenFileName(

            self,

            "Import Process File",

            "",

            "CSV Files (*.csv);;Excel Files (*.xlsx);;JSON Files (*.json)"

        )

        if not filename:
            return

        try:

            processes = Importer.load_and_validate(filename)

            self.table.setRowCount(0)

            for process in processes:

                row = self.table.rowCount()

                self.table.insertRow(row)

                self.table.setItem(
                    row,
                    0,
                    QTableWidgetItem(process.pid)
                )

                self.table.setItem(
                    row,
                    1,
                    QTableWidgetItem(
                        str(process.arrival_time)
                    )
                )

                self.table.setItem(
                    row,
                    2,
                    QTableWidgetItem(
                        str(process.burst_time)
                    )
                )

                self.table.setItem(
                    row,
                    3,
                    QTableWidgetItem(
                        str(process.priority)
                    )
                )

                self.table.setItem(
                    row,
                    4,
                    QTableWidgetItem("")
                )

                self.table.setItem(
                    row,
                    5,
                    QTableWidgetItem("")
                )

                self.table.setItem(
                    row,
                    6,
                    QTableWidgetItem("")
                )

            self.statusBar().showMessage(
                "Import Successful"
            )

        except Exception as e:

            QMessageBox.critical(

                self,

                "Import Error",

                str(e)

            )

    # ============================================
    # EXPORT FILE
    # ============================================

    def export_file(self):

        filename, _ = QFileDialog.getSaveFileName(

            self,

            "Export Process File",

            "",

            "CSV Files (*.csv);;Excel Files (*.xlsx);;JSON Files (*.json);;PDF Files (*.pdf)"

        )

        if not filename:
            return

        try:

            Exporter.export(

                self.get_processes(),

                filename

            )

            self.statusBar().showMessage(

                "Export Successful"

            )

        except Exception as e:

            QMessageBox.critical(

                self,

                "Export Error",

                str(e)

            )

    # ============================================
    # ADD PROCESS
    # ============================================

    def add_process(self):

        row = self.table.rowCount()

        self.table.insertRow(row)

        self.table.setItem(
            row,
            0,
            QTableWidgetItem(f"P{row+1}")
        )

        self.table.setItem(
            row,
            1,
            QTableWidgetItem("0")
        )

        self.table.setItem(
            row,
            2,
            QTableWidgetItem("1")
        )

        self.table.setItem(
            row,
            3,
            QTableWidgetItem("1")
        )

        self.table.setItem(row,4,QTableWidgetItem(""))
        self.table.setItem(row,5,QTableWidgetItem(""))
        self.table.setItem(row,6,QTableWidgetItem(""))

    # ============================================
    # DELETE PROCESS
    # ============================================

    def delete_process(self):

        row = self.table.currentRow()

        if row >= 0:

            self.table.removeRow(row)

    # ============================================
    # CLEAR TABLE
    # ============================================

    def clear_processes(self):

        self.table.setRowCount(0)

        self.progress.setValue(0)

        self.gantt.clear_chart()

        self.current_process_label.setText(
            "Current Process : -"
        )

        self.current_time_label.setText(
            "Current Time : 0"
        )

        self.completed_label.setText(
            "Completed : 0"
        )

        self.statusBar().showMessage(
            "Table Cleared"
        )
        # ============================================
    # RANDOM PROCESS GENERATOR
    # ============================================

    def generate_random_processes(self):

        self.table.setRowCount(0)

        count = random.randint(5, 8)

        for i in range(count):

            row = self.table.rowCount()

            self.table.insertRow(row)

            pid = f"P{i+1}"

            arrival = random.randint(0, 8)

            burst = random.randint(1, 10)

            priority = random.randint(1, 5)

            self.table.setItem(
                row,0,QTableWidgetItem(pid)
            )

            self.table.setItem(
                row,1,QTableWidgetItem(str(arrival))
            )

            self.table.setItem(
                row,2,QTableWidgetItem(str(burst))
            )

            self.table.setItem(
                row,3,QTableWidgetItem(str(priority))
            )

            self.table.setItem(
                row,4,QTableWidgetItem("")
            )

            self.table.setItem(
                row,5,QTableWidgetItem("")
            )

            self.table.setItem(
                row,6,QTableWidgetItem("")
            )

        self.statusBar().showMessage(
            f"{count} Random Processes Generated"
        )

    # ============================================
    # GET PROCESSES
    # ============================================

    def get_processes(self):

        processes = []

        try:

            for row in range(self.table.rowCount()):

                pid = self.table.item(row,0).text()

                arrival = int(
                    self.table.item(row,1).text()
                )

                burst = int(
                    self.table.item(row,2).text()
                )

                priority = int(
                    self.table.item(row,3).text()
                )

                processes.append(

                    Process(

                        pid=pid,

                        arrival_time=arrival,

                        burst_time=burst,

                        priority=priority

                    )

                )

        except Exception:

            QMessageBox.warning(

                self,

                "Invalid Input",

                "Please check the table values."

            )

            return []

        return processes

    # ============================================
    # RUN SIMULATION
    # ============================================

    def test_processes(self):

        processes = self.get_processes()

        if not processes:
            return

        algorithm = self.algorithm_combo.currentText()

        quantum = self.quantum_box.value()

        try:

            result = run_algorithm(

                algorithm,

                processes,

                quantum

            )

            print("=== RESULT ===")
            for p in result.processes:
                print(
                    p.pid,
                    p.arrival_time,
                    p.burst_time,
                    p.completion_time,
                    p.waiting_time,
                    p.turnaround_time
                )

        except Exception as e:

            QMessageBox.critical(

                self,

                "Scheduler Error",

                str(e)

            )

            return

        self.algorithm_label.setText(

            f"Algorithm : {algorithm}"

        )

        self.gantt.set_timeline(

            result.timeline

        )

        self.animator.window = self

        self.animator.start(

            result.timeline,

            self.speed_slider.value()

        )

        self.update_table(

            result.processes

        )

        self.update_statistics(

            result.processes

        )

        self.statusBar().showMessage(

            f"{algorithm} Completed Successfully"

        )

    # ============================================
    # UPDATE TABLE
    # ============================================

    # ==========================================================
# UPDATE TABLE
# ==========================================================

    def update_table(self, processes):

    # Match processes using PID instead of row index
        process_map = {}

        for p in processes:
            process_map[p.pid] = p

        for row in range(self.table.rowCount()):

            item = self.table.item(row, 0)

            if item is None:
                continue

            pid = item.text()

            if pid not in process_map:
                continue

            process = process_map[pid]

        # Arrival Time
            self.table.setItem(
                row,
                1,
                QTableWidgetItem(str(process.arrival_time))
            )

        # Burst Time
            self.table.setItem(
                row,
                2,
                QTableWidgetItem(str(process.burst_time))
            )

        # Priority
            self.table.setItem(
                row,
                3,
                QTableWidgetItem(str(process.priority))
            )

        # Completion Time
            self.table.setItem(
                row,
                4,
                QTableWidgetItem(str(process.completion_time))
            )

        # Waiting Time
            self.table.setItem(
                row,
                5,
                QTableWidgetItem(str(process.waiting_time))
            )

        # Turnaround Time
            self.table.setItem(
                row,
                6,
                QTableWidgetItem(str(process.turnaround_time))
            )

        self.table.viewport().update()
        # ============================================
    # UPDATE STATISTICS
    # ============================================

    def update_statistics(self, processes):

        if not processes:
            return

        avg_wait = sum(
            p.waiting_time for p in processes
        ) / len(processes)

        avg_tat = sum(
            p.turnaround_time for p in processes
        ) / len(processes)

        completed = len([
            p for p in processes
            if p.completion_time > 0
        ])

        total_burst = sum(
            p.burst_time for p in processes
        )

        finish_time = max(
            p.completion_time for p in processes
        )

        cpu = 0

        if finish_time > 0:

            cpu = (
                total_burst /
                finish_time
            ) * 100

        self.completed_label.setText(
            f"Completed : {completed}/{len(processes)}"
        )

        self.avg_waiting_label.setText(
            f"Average Waiting : {avg_wait:.2f}"
        )

        self.avg_turnaround_label.setText(
            f"Average Turnaround : {avg_tat:.2f}"
        )

        self.cpu_label.setText(
            f"CPU Utilization : {cpu:.2f}%"
        )

    # ============================================
    # COMPARE ALGORITHMS
    # ============================================

    def compare_algorithms(self):

        processes = self.get_processes()

        if not processes:
            return

        try:

            result = self.comparison.compare(

                processes,

                self.quantum_box.value()

            )

            if result:

                self.chart.plot(result)

                self.statusBar().showMessage(

                    "Algorithm Comparison Completed"

                )

        except Exception as e:

            QMessageBox.critical(

                self,

                "Comparison Error",

                str(e)

            )

    # ============================================
    # PAUSE ANIMATION
    # ============================================

    def pause_animation(self):

        try:

            self.animator.pause()

            self.statusBar().showMessage(

                "Simulation Paused"

            )

        except Exception:

            pass

    # ============================================
    # RESET ANIMATION
    # ============================================

    def reset_animation(self):

        try:

            self.animator.stop()

        except Exception:

            pass

        try:

            self.animator.reset()

        except Exception:

            pass

        try:

            self.gantt.clear_chart()

        except Exception:

            pass

        self.progress.setValue(0)

        self.algorithm_label.setText(
            "Algorithm : -"
        )

        self.current_process_label.setText(
            "Current Process : -"
        )

        self.current_time_label.setText(
            "Current Time : 0"
        )

        self.completed_label.setText(
            "Completed : 0"
        )

        self.avg_waiting_label.setText(
            "Average Waiting : 0"
        )

        self.avg_turnaround_label.setText(
            "Average Turnaround : 0"
        )

        self.cpu_label.setText(
            "CPU Utilization : 0%"
        )

        self.statusBar().showMessage(
            "Simulation Reset"
        )

    # ============================================
    # PROGRESS CALLBACK
    # ============================================

    def update_progress(
        self,
        current,
        total,
        pid
    ):

        if total <= 0:
            return

        percent = int(
            (current / total) * 100
        )

        self.progress.setValue(percent)

        self.current_process_label.setText(

            f"Current Process : {pid}"

        )

        self.current_time_label.setText(

            f"Current Time : {current}"

        )


    # ============================================
# LOAD SYSTEM PROCESSES
# ============================================

    def load_system_processes(self):

        loader = SystemProcessLoader()

        data = loader.load_processes()

        self.table.setRowCount(0)

        for process in data:

            row = self.table.rowCount()

            self.table.insertRow(row)

            self.table.setItem(
                row,
                0,
                QTableWidgetItem(process["pid"])
            )

            self.table.setItem(
                row,
                1,
                QTableWidgetItem(str(process["arrival"]))
            )

            self.table.setItem(
                row,
                2,
                QTableWidgetItem(str(process["burst"]))
            )

            self.table.setItem(
                row,
                3,
                QTableWidgetItem(str(process["priority"]))
            )

            self.table.setItem(
                row,
                4,
                QTableWidgetItem("")
            )

            self.table.setItem(
                row,
                5,
                QTableWidgetItem("")
            )

            self.table.setItem(
                row,
                6,
                QTableWidgetItem("")
            )

        self.statusBar().showMessage(
            "Real System Processes Loaded"
        )

    # ============================================
    # ABOUT
    # ============================================

    def show_about(self):

        QMessageBox.about(
        self,
            "About CPU Scheduler Pro",
            """
            <h2>CPU Scheduler Pro</h2>

            <p><b>Version:</b> 2.0</p>

            <p>CPU Scheduling Simulator</p>

            <p>Algorithms Supported:</p>

            <ul>
            <li>FCFS</li>
            <li>SJF</li>
            <li>SJF Preemptive</li>
            <li>Priority</li>
            <li>Priority Preemptive</li>
            <li>Round Robin</li>
            </ul>

            <p>Developed using Python & PyQt6</p>
            """
        )