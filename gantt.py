from PyQt6.QtWidgets import QWidget
from PyQt6.QtGui import (
    QPainter,
    QColor,
    QPen,
    QBrush,
    QFont,
)
from PyQt6.QtCore import (
    Qt,
    QSize,
)


class GanttChart(QWidget):

    def __init__(self):
        super().__init__()

        # Timeline blocks
        self.timeline = []

        # Drawing properties
        self.scale = 40
        self.margin = 40
        self.row_height = 60
        self.block_height = 50

        # Animation
        self.current_block = -1

        # Colors
        self.background_color = QColor("#202124")
        self.grid_color = QColor("#404040")
        self.border_color = QColor("#5F6368")
        self.text_color = QColor("white")
        self.highlight_color = QColor("#FFD54F")

        # Widget sizing
        self.setMinimumHeight(220)
        self.setMinimumWidth(900)

        self.setAutoFillBackground(False)

    # --------------------------------------------------
    # Timeline
    # --------------------------------------------------

    def set_timeline(self, timeline):

        self.timeline = timeline

        self.current_block = -1

        if self.timeline:

            total = self.timeline[-1].end

            width = (
                total * self.scale
                + self.margin * 2
                + 120
            )

            self.setMinimumWidth(width)

            self.resize(width, 220)

        self.update()

    # --------------------------------------------------

    def clear_chart(self):

        self.timeline = []

        self.current_block = -1

        self.setMinimumWidth(900)

        self.resize(900, 220)

        self.update()

    # --------------------------------------------------

    def set_current_block(self, index):

        self.current_block = index

        self.update()

    # --------------------------------------------------

    def zoom_in(self):

        self.scale += 10

        if self.timeline:

            total = self.timeline[-1].end

            width = (
                total * self.scale
                + self.margin * 2
                + 120
            )

            self.setMinimumWidth(width)

            self.resize(width, 220)

        self.update()

    # --------------------------------------------------

    def zoom_out(self):

        if self.scale > 20:

            self.scale -= 10

        if self.timeline:

            total = self.timeline[-1].end

            width = (
                total * self.scale
                + self.margin * 2
                + 120
            )

            self.setMinimumWidth(width)

            self.resize(width, 220)

        self.update()

    # --------------------------------------------------

    def sizeHint(self):

        if self.timeline:

            return QSize(

                self.timeline[-1].end * self.scale
                + self.margin * 2
                + 120,

                220

            )

        return QSize(900, 220)

    # --------------------------------------------------

    def minimumSizeHint(self):

        return self.sizeHint()

    # --------------------------------------------------

    def paintEvent(self, event):

        painter = QPainter(self)

        painter.setRenderHint(
            QPainter.RenderHint.Antialiasing
        )

        painter.fillRect(
            self.rect(),
            self.background_color
        )

        if not self.timeline:

            painter.setPen(Qt.GlobalColor.white)

            painter.setFont(
                QFont(
                    "Segoe UI",
                    12,
                    QFont.Weight.Bold
                )
            )

            painter.drawText(
                self.rect(),
                Qt.AlignmentFlag.AlignCenter,
                "No Schedule Available"
            )

            return

        start_x = self.margin

        y = 60

                # =====================================================
        # Title
        # =====================================================

        painter.setPen(self.text_color)

        painter.setFont(
            QFont(
                "Segoe UI",
                12,
                QFont.Weight.Bold
            )
        )

        painter.drawText(
            15,
            28,
            "Gantt Chart"
        )

        # =====================================================
        # Grid
        # =====================================================

        total = self.timeline[-1].end

        painter.setPen(

            QPen(

                self.grid_color,

                1,

                Qt.PenStyle.DashLine

            )

        )

        for t in range(total + 1):

            x = start_x + t * self.scale

            painter.drawLine(

                x,

                35,

                x,

                170

            )

        # =====================================================
        # Timeline Blocks
        # =====================================================

        painter.setFont(

            QFont(

                "Segoe UI",

                10,

                QFont.Weight.Bold

            )

        )

        for index, block in enumerate(self.timeline):

            x = start_x + block.start * self.scale

            width = max(

                30,

                (block.end - block.start)

                * self.scale

            )

            # ------------------------------------------

            # Current Running Process Highlight

            # ------------------------------------------

            if index == self.current_block:

                painter.setBrush(

                    self.highlight_color

                )

                painter.setPen(

                    QPen(

                        QColor("#FFFFFF"),

                        3

                    )

                )

            else:

                painter.setBrush(

                    QBrush(

                        QColor(block.color)

                    )

                )

                painter.setPen(

                    QPen(

                        QColor("#FFFFFF"),

                        2

                    )

                )

            painter.drawRoundedRect(

                x,

                y,

                width,

                self.block_height,

                10,

                10

            )

            painter.setPen(

                Qt.GlobalColor.white

            )

            painter.drawText(

                x,

                y,

                width,

                self.block_height,

                Qt.AlignmentFlag.AlignCenter,

                block.pid

            )

        # =====================================================
        # Time Scale
        # =====================================================

        painter.setPen(

            QPen(

                Qt.GlobalColor.white,

                2

            )

        )

        painter.setFont(

            QFont(

                "Segoe UI",

                9

            )

        )

        for block in self.timeline:

            x = start_x + block.start * self.scale

            painter.drawLine(

                x,

                y + self.block_height,

                x,

                y + self.block_height + 8

            )

            painter.drawText(

                x - 8,

                y + self.block_height + 25,

                str(block.start)

            )

        end_x = start_x + total * self.scale

        painter.drawLine(

            end_x,

            y + self.block_height,

            end_x,

            y + self.block_height + 8

        )

        painter.drawText(

            end_x - 8,

            y + self.block_height + 25,

            str(total)

        )

                # =====================================================
        # Bottom Timeline Line
        # =====================================================

        painter.setPen(
            QPen(
                QColor("#BDBDBD"),
                2
            )
        )

        painter.drawLine(
            start_x,
            y + self.block_height + 10,
            end_x,
            y + self.block_height + 10
        )

        # =====================================================
        # Outer Border
        # =====================================================

        painter.setPen(
            QPen(
                self.border_color,
                1
            )
        )

        painter.setBrush(Qt.BrushStyle.NoBrush)

        painter.drawRoundedRect(
            self.rect().adjusted(
                1,
                1,
                -2,
                -2
            ),
            8,
            8
        )

        painter.end()

    # --------------------------------------------------
    # Mouse Wheel Zoom
    # --------------------------------------------------

    def wheelEvent(self, event):

        if event.modifiers() & Qt.KeyboardModifier.ControlModifier:

            if event.angleDelta().y() > 0:

                self.zoom_in()

            else:

                self.zoom_out()

            event.accept()

            return

        super().wheelEvent(event)

    # --------------------------------------------------
    # Resize Event
    # --------------------------------------------------

    def resizeEvent(self, event):

        super().resizeEvent(event)

        self.update()

    # --------------------------------------------------
    # Leave Event
    # --------------------------------------------------

    def leaveEvent(self, event):

        self.update()

        super().leaveEvent(event)

    # --------------------------------------------------
    # Mouse Events
    # --------------------------------------------------

    def mousePressEvent(self, event):

        super().mousePressEvent(event)

    def mouseMoveEvent(self, event):

        super().mouseMoveEvent(event)

    def mouseReleaseEvent(self, event):

        super().mouseReleaseEvent(event)