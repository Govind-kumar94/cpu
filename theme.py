class ThemeManager:

    @staticmethod
    def dark():

        return """
QMainWindow{
    background:#202124;
}

QWidget{
    background:#202124;
    color:white;
    font-family:Segoe UI;
    font-size:11pt;
}

QGroupBox{
    border:2px solid #404040;
    border-radius:12px;
    margin-top:10px;
    font-weight:bold;
}

QGroupBox::title{
    subcontrol-origin:margin;
    left:10px;
    padding:4px;
}

QPushButton{

    background:#2196F3;

    color:white;

    border:none;

    border-radius:8px;

    padding:8px;

    font-weight:bold;

}

QPushButton:hover{

    background:#42A5F5;

}

QPushButton:pressed{

    background:#1565C0;

}

QComboBox,
QSpinBox{

    background:#303134;

    border:1px solid #555;

    border-radius:6px;

    padding:4px;

    color:white;

}

QSlider::groove:horizontal{

    height:6px;

    background:#555;

}

QSlider::handle:horizontal{

    width:16px;

    background:#2196F3;

    border-radius:8px;

}

QTableWidget{

    background:#2B2B2B;

    alternate-background-color:#353535;

    color:white;

    gridline-color:#555;

}

QHeaderView::section{

    background:#3C4043;

    color:white;

    padding:5px;

    border:none;

}

QProgressBar{

    border:1px solid gray;

    border-radius:8px;

    text-align:center;

}

QProgressBar::chunk{

    background:#4CAF50;

}

QStatusBar{

    background:#303134;

}

QMenuBar{

    background:#303134;

    color:white;

}

QMenuBar::item:selected{

    background:#1976D2;

}

QMenu{

    background:#303134;

    color:white;

}
"""

    # ======================================================

    @staticmethod
    def light():

        return """
QMainWindow{

    background:white;

}

QWidget{

    background:white;

    color:black;

    font-family:Segoe UI;

    font-size:11pt;

}

QGroupBox{

    border:2px solid lightgray;

    border-radius:12px;

    margin-top:10px;

    font-weight:bold;

}

QPushButton{

    background:#1976D2;

    color:white;

    border-radius:8px;

    padding:8px;

}

QPushButton:hover{

    background:#2196F3;

}

QComboBox,
QSpinBox{

    padding:4px;

}

QTableWidget{

    alternate-background-color:#F5F5F5;

}

QHeaderView::section{

    background:#EEEEEE;

}
"""

    # ======================================================

    @staticmethod
    def green():

        return """
QPushButton{

    background:#43A047;

    color:white;

    border-radius:8px;

    padding:8px;

}

QPushButton:hover{

    background:#66BB6A;

}

QProgressBar::chunk{

    background:#43A047;

}
"""

    # ======================================================

    @staticmethod
    def blue():

        return """
QPushButton{

    background:#1E88E5;

    color:white;

    border-radius:8px;

    padding:8px;

}

QPushButton:hover{

    background:#42A5F5;

}

QProgressBar::chunk{

    background:#1E88E5;

}
"""

    # ======================================================

    @staticmethod
    def apply(window, theme="dark"):

        if theme == "dark":

            window.setStyleSheet(

                ThemeManager.dark()

            )

        elif theme == "light":

            window.setStyleSheet(

                ThemeManager.light()

            )

        elif theme == "green":

            window.setStyleSheet(

                ThemeManager.green()

            )

        elif theme == "blue":

            window.setStyleSheet(

                ThemeManager.blue()

            )

        else:

            window.setStyleSheet(

                ThemeManager.dark()

            )