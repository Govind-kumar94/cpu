import sys

from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont, QPixmap
from PyQt6.QtWidgets import (
    QApplication,
    QSplashScreen,
    QMessageBox,
)

from gui import MainWindow
from theme import ThemeManager


# ==========================================================
# Splash Screen
# ==========================================================

class SplashScreen(QSplashScreen):

    def __init__(self):

        pixmap = QPixmap(700, 400)
        pixmap.fill(Qt.GlobalColor.black)

        super().__init__(pixmap)

        self.showMessage(
            "\n\nCPU Scheduler Pro\n\nLoading Modules...",
            Qt.AlignmentFlag.AlignCenter,
            Qt.GlobalColor.white,
        )

        self.setFont(
            QFont(
                "Segoe UI",
                16,
                QFont.Weight.Bold,
            )
        )


# ==========================================================
# Main
# ==========================================================

def main():

    app = QApplication(sys.argv)

    app.setApplicationName("CPU Scheduler Pro")
    app.setApplicationVersion("2.0")
    app.setOrganizationName("COA Project")

    splash = SplashScreen()
    splash.show()

    app.processEvents()

    window = MainWindow()

    ThemeManager.apply(window, "dark")

    window.show()

    splash.finish(window)

    sys.exit(app.exec())


# ==========================================================
# Error Handling
# ==========================================================

if __name__ == "__main__":

    try:

        main()

    except Exception as e:

        app = QApplication.instance()

        if app is None:
            app = QApplication(sys.argv)

        QMessageBox.critical(
            None,
            "Application Error",
            str(e),
        )

        sys.exit(1)