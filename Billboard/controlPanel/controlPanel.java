package Billboard.controlPanel;

import java.io.*;
import java.net.Socket;
import java.util.Properties;

/**
 * The Control Panel, an interactive GUI application.
 * Displays the control panel with all of its functional features.
 */
public class controlPanel {

    public static void main(String[] args) throws IOException {
        //Instantiating the controlPanelGUI class
        controlPanelGUI gui = new controlPanelGUI();

        //Displaying the GUI
        gui.generateLoginUI();
    }
}