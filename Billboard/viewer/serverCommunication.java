package Billboard.viewer;

import Billboard.controlPanel.billboard;

import java.io.*;
import java.net.Socket;
import java.security.NoSuchAlgorithmException;
import java.util.Properties;

import static Billboard.server.passEncryption.bytesToString;
import static Billboard.server.passEncryption.toBytes;

public class serverCommunication {
    private ObjectOutputStream oos;
    private ObjectInputStream ois;
    private Socket socket;

    public serverCommunication() throws IOException {
        //Getting the socket information from the properties file
        final String server_props = "./src/billboard/server/properties/server.props";
        InputStream fS = new FileInputStream(server_props);
        Properties props = new Properties();
        props.load(fS);
        final String serverHost = props.getProperty("server.host");
        final int serverPort = Integer.parseInt(props.getProperty("server.port"));

        //Setting up the socket and I/O streams
        socket = new Socket(serverHost, serverPort);
        oos = new ObjectOutputStream(socket.getOutputStream());
        ois = new ObjectInputStream(socket.getInputStream());
    }

    public String getXML() throws IOException, ClassNotFoundException {
        oos.writeUTF("viewerREQ;getXML");
        oos.flush();

        return ois.readUTF();
    }

    public void disconnect() throws IOException {
        oos.close();
        ois.close();
        socket.close();
    }

}