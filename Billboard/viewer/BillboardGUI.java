package Billboard.viewer;

import javax.swing.*;
import java.awt.*;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.IOException;
import java.net.ConnectException;
import Billboard.controlPanel.billboard;

/**
 * Creates an instance of a Billboard Viewer GUI application seen by a user.
 */
public class BillboardGUI extends JFrame {
    private serverCommunication server;
    private final Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
    //private String xmlFile = "billboard/error.xml";
    /**
     * Creates a fullscreen Billboard window extended from JFrame.
     * Utilizes the BillboardConstructor Class to construct an instance of a billboard.
     */
    public BillboardGUI(String xmlFile) throws IOException, ClassNotFoundException, InterruptedException {

        server = new serverCommunication();
        server.getXML();
        server.disconnect();
        BillboardConstructor billboard = new BillboardConstructor(xmlFile, screenSize);
        add(billboard);
        // Displays the application in fullscreen mode
        setExtendedState(JFrame.MAXIMIZED_BOTH);
        setUndecorated(true);
        // Adds the billboard

        // Exits the application
        exitProgram();
        pack();

    }

    /**
     * Exits the application if a 'mouse click' is performed or 'esc' is pressed
     */
    public void exitProgram() {
        // If a 'mouse click' is performed, exit the program
        addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                if(e.getButton() == MouseEvent.BUTTON1) {
                    System.exit(0);
                }
            }
            @Override
            public void mouseClicked(MouseEvent e) {}
            @Override
            public void mouseReleased(MouseEvent e) {}
            @Override
            public void mouseEntered(MouseEvent e) {}
            @Override
            public void mouseExited(MouseEvent e) {}
        });

        // If 'esc' is pressed, exit the program
        addKeyListener(new KeyListener() {
            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
                    System.exit(0);
                }
            }
            @Override
            public void keyReleased(KeyEvent e) {}
            @Override
            public void keyTyped(KeyEvent e) {}
        });

    }

}
