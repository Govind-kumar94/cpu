import csv
import json
import os

from openpyxl import Workbook

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
)


class Exporter:

    # -------------------------------------------------
    # Safe Getter
    # -------------------------------------------------

    @staticmethod
    def safe(obj, attr, default=0):

        return getattr(obj, attr, default)

    # -------------------------------------------------
    # CSV
    # -------------------------------------------------

    @staticmethod
    def export_csv(processes, filename):

        try:

            with open(
                filename,
                "w",
                newline="",
                encoding="utf-8"
            ) as file:

                writer = csv.writer(file)

                writer.writerow([

                    "PID",

                    "Arrival",

                    "Burst",

                    "Priority",

                    "Completion",

                    "Waiting",

                    "Turnaround",

                    "Response"

                ])

                for p in processes:

                    writer.writerow([

                        Exporter.safe(p, "pid", ""),

                        Exporter.safe(p, "arrival_time"),

                        Exporter.safe(p, "burst_time"),

                        Exporter.safe(p, "priority"),

                        Exporter.safe(p, "completion_time"),

                        Exporter.safe(p, "waiting_time"),

                        Exporter.safe(p, "turnaround_time"),

                        Exporter.safe(p, "response_time")

                    ])

            return True

        except Exception as e:

            print("CSV Export Error :", e)

            return False

    # -------------------------------------------------
    # EXCEL
    # -------------------------------------------------

    @staticmethod
    def export_excel(processes, filename):

        try:

            wb = Workbook()

            ws = wb.active

            ws.title = "CPU Scheduling"

            ws.append([

                "PID",

                "Arrival",

                "Burst",

                "Priority",

                "Completion",

                "Waiting",

                "Turnaround",

                "Response"

            ])

            for p in processes:

                ws.append([

                    Exporter.safe(p, "pid", ""),

                    Exporter.safe(p, "arrival_time"),

                    Exporter.safe(p, "burst_time"),

                    Exporter.safe(p, "priority"),

                    Exporter.safe(p, "completion_time"),

                    Exporter.safe(p, "waiting_time"),

                    Exporter.safe(p, "turnaround_time"),

                    Exporter.safe(p, "response_time")

                ])

            wb.save(filename)

            return True

        except Exception as e:

            print("Excel Export Error :", e)

            return False

    # -------------------------------------------------
    # JSON
    # -------------------------------------------------

    @staticmethod
    def export_json(processes, filename):

        try:

            data = []

            for p in processes:

                data.append({

                    "pid":
                        Exporter.safe(p, "pid", ""),

                    "arrival":
                        Exporter.safe(p, "arrival_time"),

                    "burst":
                        Exporter.safe(p, "burst_time"),

                    "priority":
                        Exporter.safe(p, "priority"),

                    "completion":
                        Exporter.safe(p, "completion_time"),

                    "waiting":
                        Exporter.safe(p, "waiting_time"),

                    "turnaround":
                        Exporter.safe(p, "turnaround_time"),

                    "response":
                        Exporter.safe(p, "response_time")

                })

            with open(

                filename,

                "w",

                encoding="utf-8"

            ) as file:

                json.dump(

                    data,

                    file,

                    indent=4

                )

            return True

        except Exception as e:

            print("JSON Export Error :", e)

            return False
        # -------------------------------------------------
    # PDF EXPORT
    # -------------------------------------------------

    @staticmethod
    def export_pdf(processes, filename):

        try:

            document = SimpleDocTemplate(
                filename,
                pagesize=A4
            )

            data = [[
                "PID",
                "Arrival",
                "Burst",
                "Priority",
                "Completion",
                "Waiting",
                "Turnaround",
                "Response"
            ]]

            for p in processes:

                data.append([

                    Exporter.safe(p, "pid", ""),

                    Exporter.safe(p, "arrival_time"),

                    Exporter.safe(p, "burst_time"),

                    Exporter.safe(p, "priority"),

                    Exporter.safe(p, "completion_time"),

                    Exporter.safe(p, "waiting_time"),

                    Exporter.safe(p, "turnaround_time"),

                    Exporter.safe(p, "response_time")

                ])

            table = Table(data)

            table.setStyle(

                TableStyle([

                    ("BACKGROUND", (0, 0), (-1, 0), colors.darkblue),

                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),

                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),

                    ("GRID", (0, 0), (-1, -1), 1, colors.black),

                    ("BACKGROUND", (0, 1), (-1, -1), colors.beige),

                    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),

                    ("BOTTOMPADDING", (0, 0), (-1, 0), 10),

                ])

            )

            document.build([table])

            return True

        except Exception as e:

            print("PDF Export Error:", e)

            return False

    # -------------------------------------------------
    # EXPORT GANTT WIDGET
    # -------------------------------------------------

    @staticmethod
    def export_widget(widget, filename):

        try:

            pixmap = widget.grab()

            pixmap.save(filename)

            return True

        except Exception as e:

            print("Widget Export Error:", e)

            return False

    # -------------------------------------------------
    # EXPORT MATPLOTLIB CHART
    # -------------------------------------------------

    @staticmethod
    def export_chart(chart, filename):

        try:

            chart.figure.savefig(
                filename,
                dpi=300,
                bbox_inches="tight"
            )

            return True

        except Exception as e:

            print("Chart Export Error:", e)

            return False

    # -------------------------------------------------
    # AUTO EXPORT
    # -------------------------------------------------

    @staticmethod
    def export(processes, filename):

        ext = os.path.splitext(filename)[1].lower()

        if ext == ".csv":

            return Exporter.export_csv(
                processes,
                filename
            )

        elif ext == ".xlsx":

            return Exporter.export_excel(
                processes,
                filename
            )

        elif ext == ".json":

            return Exporter.export_json(
                processes,
                filename
            )

        elif ext == ".pdf":

            return Exporter.export_pdf(
                processes,
                filename
            )

        else:

            raise ValueError(
                "Unsupported export format."
            )

    # -------------------------------------------------
    # CHECK FILE
    # -------------------------------------------------

    @staticmethod
    def exists(filename):

        return os.path.exists(filename)

    # -------------------------------------------------
    # DELETE FILE
    # -------------------------------------------------

    @staticmethod
    def remove(filename):

        if os.path.exists(filename):

            os.remove(filename)

            return True

        return False