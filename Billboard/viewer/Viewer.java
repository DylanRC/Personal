package Billboard.viewer;


import java.io.IOException;

/**
 * The Billboard Viewer, a fullscreen non-interactive GUI application.
 * Displays the content provided in a given Billboard from the server, at which it will request from every 15 seconds.
 */
public class Viewer {
    public static void main(String[] args) throws InterruptedException, IOException, ClassNotFoundException {
        // Instantiating the BillboardGUI class and creating the billboard viewer GUI object
        BillboardGUI billboard = new BillboardGUI("billboard/error.xml");
        // Displaying the billboard
        billboard.setVisible(true);
        Thread.sleep(15000);

        BillboardGUI billboard2 = new BillboardGUI("billboard/1.xml");
        // Displaying the billboard
        billboard2.setVisible(true);
        billboard.dispose();
        Thread.sleep(15000);

        BillboardGUI billboard3 = new BillboardGUI("billboard/2.xml");
        // Displaying the billboard
        billboard3.setVisible(true);
        billboard2.dispose();
        Thread.sleep(15000);

        BillboardGUI billboard4 = new BillboardGUI("billboard/3.xml");
        // Displaying the billboard
        billboard4.setVisible(true);
        billboard3.dispose();
        Thread.sleep(15000);

    }
}
