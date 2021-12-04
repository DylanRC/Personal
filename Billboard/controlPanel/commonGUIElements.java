package Billboard.controlPanel;

import javax.swing.*;
import java.awt.*;

/**
 * This class contains the common GUI elements used throughout the creation of the control panel.
 */
public class commonGUIElements {
    private int windowX;
    private int windowY;
    private int scale;

    /**
     * Sets the common GUI elements to an appropriate size.
     * @param windowX The width of the window
     * @param windowY The height of the window
     * @param scale The scale size
     */
    public commonGUIElements(int windowX, int windowY, int scale) {
        this.windowX = windowX;
        this.windowY = windowY;
        this.scale = scale;
    }

    /**
     * This function is responsible for generating the default window for displaying the billboard control panel.
     * @return The window with all of the given specifications
     */
    public JFrame setupWindow() {
        JFrame window = new JFrame("Billboard Control Panel");
        window.setVisible(true);
        window.setSize(windowX, windowY);
        window.setResizable(false);
        window.setLocation((windowX-windowX/2), (windowY-windowY/2));
        window.setDefaultCloseOperation(WindowConstants.EXIT_ON_CLOSE);

        return window;
    }

    /**
     * Generates a labeled warning message.
     * @param message The message displayed in the label
     * @return The JLabel containing the components which make up the warning message
     */
    public JLabel generateWarning(String message) {
        JLabel warning = new JLabel(message);
        warning.setBounds((windowX/2)-(88*scale), 30*scale, 176*scale, 40*scale);
        warning.setFont(new Font("Arial", Font.BOLD, 30*scale));
        warning.setForeground(Color.red);

        return warning;
    }

    /**
     * Sets up the dialog window used throughout the control panel GUI.
     * @param x The width of the dialog window
     * @param y The height of the dialog window
     * @param title The window title
     * @return The dialog window with all of the given specifications
     */
    public JDialog setupDialog(int x, int y, String title) {
        JDialog dialog = new JDialog();
        dialog.setSize(x, y);
        dialog.setTitle(title);
        dialog.setLocation((windowX-(x/2)), (windowY-(y/2)));
        dialog.setModal(true);
        dialog.setResizable(false);

        return dialog;
    }

    /**
     * Sets up a text field with an accompanying label
     * @param x The bounds of the width
     * @param y The bounds of the height
     * @param labelText The text displayed within the label before the input field
     * @return The JPanel containing all of the components that make up the labeled field
     */
    public JPanel setupLabeledField(int x, int y, String labelText) {
        Font textStyle = new Font("Arial", Font.BOLD, 15*scale);

        JPanel panel = new JPanel();
        panel.setLayout(null);
        panel.setBounds(x, y, 200*scale, 50*scale);

        JLabel label = new JLabel(labelText);
        JTextField field = new JTextField();
        panel.add(label);
        panel.add(field);
        label.setBounds(0, 0, 200*scale, 25*scale);
        label.setFont(textStyle);
        field.setBounds(0, 25, 200*scale, 25*scale);

        return panel;
    }

    /**
     * Retrieves the text field from a component (helper method for labeled field)
     * @param panel The panel of the correlating component
     * @return The text field of a component, otherwise return null.
     */
    public JTextField getTextField(JPanel panel) {
        for (Component component : panel.getComponents()) {
            if (component instanceof JTextField) return ((JTextField) component);
        }

        return null;
    }

    /**
     * Displays a list of a particular elements instances.
     * @param listElements The list of the correlating element
     * @param cellWidth The width of the cells
     * @return The Jlist of the element instances
     */
    public JList list(String[] listElements, int cellWidth) {
        //Displays the list elements
        JList list = new JList(listElements);
        list.setFixedCellWidth(cellWidth);
        list.setLayoutOrientation(JList.HORIZONTAL_WRAP);
        list.setFont(new Font("Arial", Font.PLAIN ,15 * scale));
        list.setVisibleRowCount(-1);
        //Center aligning the text
        DefaultListCellRenderer renderer = (DefaultListCellRenderer) list.getCellRenderer();
        renderer.setHorizontalAlignment(SwingConstants.CENTER);

        return list;
    }
}