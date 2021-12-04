package Billboard.controlPanel;

import java.io.*;
import java.net.Socket;
import java.security.NoSuchAlgorithmException;
import java.util.Properties;
import Billboard.controlPanel.billboard;

import static Billboard.server.passEncryption.bytesToString;
import static Billboard.server.passEncryption.toBytes;

/**
 * This class is responsible for creating a connection and communicating with the server.
 */
public class serverCommunication {
    private ObjectOutputStream oos;
    private ObjectInputStream ois;

    /**
     * Sets up the communication between the control panel and the server.
     * @throws IOException If an input or output exception occurs
     */
    public serverCommunication() throws IOException {
        //Getting the socket information from the properties file
        final String server_props = "./src/billboard/server/properties/server.props";
        InputStream fS = new FileInputStream(server_props);
        Properties props = new Properties();
        props.load(fS);
        final String serverHost = props.getProperty("server.host");
        final int serverPort = Integer.parseInt(props.getProperty("server.port"));

        //Setting up the socket and I/O streams
        Socket socket = new Socket(serverHost, serverPort);
        oos = new ObjectOutputStream(socket.getOutputStream());
        ois = new ObjectInputStream(socket.getInputStream());
    }

    /**
     * Saving the login information given by the user to the server.
     * @param username The username supplied
     * @param password The password supplied
     * @return The login request
     * @throws IOException If an input or output exception occurs
     * @throws NoSuchAlgorithmException If an algorithm is requested but is not available in the environment
     */
    public String[] login(String username, String password) throws IOException, NoSuchAlgorithmException {
        String hashedPassword = bytesToString(toBytes(password));

        if (password.isEmpty()) {
            hashedPassword = "null";
        }

        oos.writeUTF("loginRequest");
        oos.writeUTF(username + ";" + hashedPassword);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * Retrieves all of the billboards within the server.
     * @param token The token of the correlating function
     * @return All of the billboards available
     * @throws IOException If an input or output exception occurs
     */
    public String[] getAllBillboards(String token) throws IOException {
        oos.writeUTF("getAllBillboards");
        oos.writeUTF(token);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * Retrieves the specified billboard
     * @param token The token of the correlating function
     * @param billboardName The name of the billboard
     * @return The billboard object
     * @throws IOException If an input or output exception occurs
     * @throws ClassNotFoundException If a class loaded at runtime could not be found in the classpath
     */
    public Object getBillboard(String token, String billboardName) throws IOException, ClassNotFoundException {
        oos.writeUTF("getBillboard");
        oos.writeUTF(token + ";" + billboardName);
        oos.flush();

        return ois.readObject();
    }

    /**
     * This function is responsible for setting up the billboard within the server
     * @param token The token of the correlating function
     * @param newBillboard The new billboard created in the server
     * @return The billboard created in the server
     * @throws IOException If an input or output exception occurs
     */
    public String[] setBillboard(String token, billboard newBillboard) throws IOException {
        oos.writeUTF("setBillboard");
        oos.writeUTF(token);
        oos.writeObject(newBillboard);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * Deletes a billboard from the server, ultimately removing it from the control panel GUI.
     * @param token The token of the correlating function
     * @param billboardName The name of the billboard
     * @return The string list where the billboard has been deleted
     * @throws IOException If an input or output exception occurs
     */
    public String[] deleteBillboard(String token, String billboardName) throws IOException {
        oos.writeUTF("deleteBillboard");
        oos.writeUTF(token + ";" + billboardName);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * The permissions granted for a particular user.
     * @param token The token of the correlating function
     * @param username The username of the user
     * @return The permissions of the user
     * @throws IOException If an input or output exception occurs
     */
    public String[] getPermissions(String token, String username) throws IOException {
        oos.writeUTF("getUserPerms");
        oos.writeUTF(token + ";" + username);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * The purpose of this function is to set a new user password.
     * @param token The token of the correlating function
     * @param password The password given by the user
     * @return The new password
     * @throws IOException If an input or output exception occurs
     * @throws NoSuchAlgorithmException If an algorithm is requested but is not available in the environment
     */
    public String[] setUserPassword(String token, String password) throws IOException, NoSuchAlgorithmException {
        String hashedPassword = bytesToString(toBytes(password));

        oos.writeUTF("setUserPass");
        oos.writeUTF(token + ";" + hashedPassword);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * Gets all of the users stored in the server.
     * @param token The token of the correlating function
     * @return A list of aLl users
     * @throws IOException If an input or output exception occurs
     */
    public String[] getAllUsers(String token) throws IOException {
        oos.writeUTF("getAllUsers");
        oos.writeUTF(token);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * Sets the information of a user within the server.
     * @param token The token of the correlating function
     * @param username The username of the user
     * @param password The password set by the user
     * @param permissions The permissions of the user
     * @return The information set by the user
     * @throws IOException If an input or output exception occurs
     * @throws NoSuchAlgorithmException If an algorithm is requested but is not available in the environment
     */
    public String[] setUser(String token, String username, String password, String permissions)
            throws IOException, NoSuchAlgorithmException {
        String hashedPassword = bytesToString(toBytes(password));

        oos.writeUTF("setUser");
        oos.writeUTF(token + ";" + username + ";" + hashedPassword + ";" + permissions);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * This function is responsible for creating a new user.
     * @param token The token of the correlating function
     * @param username The username of the user
     * @param password The password set by the user
     * @param permissions The permissions of the user
     * @return The user created in the server
     * @throws IOException If an input or output exception occurs
     * @throws NoSuchAlgorithmException If an algorithm is requested but is not available in the environment
     */
    public String[] createUser(String token, String username, String password, String permissions)
            throws IOException, NoSuchAlgorithmException {
        String hashedPassword = bytesToString(toBytes(password));

        oos.writeUTF("createUser");
        oos.writeUTF(token + ";" + username +";" + hashedPassword + ";" + permissions);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * Deletes a user within the server.
     * @param token The token of the correlating function
     * @param username The username of the user
     * @return The string list where the user has been deleted
     * @throws IOException If an input or output exception occurs
     */
    public String[] deleteUser(String token, String username) throws IOException {
        oos.writeUTF("deleteUser");
        oos.writeUTF(token + ";" + username);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * The purpose of this function is to schedule a particular billboard with supplied specifications.
     * @param token The token of the correlating function
     * @param billboard The billboard desired to schedule
     * @param day The day you want the billboard to be displayed
     * @param time The time you want the billboard to be displayed
     * @param duration The duration you want the billboard to be displayed
     * @param recursion The amount of times you want the billboard to be displayed
     * @return The schedule of the specified billboard
     * @throws IOException If an input or output exception occurs
     */
    public String[] scheduleBillboard(String token, String billboard, String day, float time, int duration, int recursion)
            throws IOException {
        oos.writeUTF("scheduleBillboard");
        oos.writeUTF(token + ";" + billboard + ";" + day + ";" + time + ";" + duration + ";" + recursion);
        oos.flush();

        return (ois.readUTF().split(";"));
    }

    /**
     * Retrieves the schedule of a billboard
     * @param token The token of the correlating function
     * @return The billboard schedule
     * @throws IOException If an input or output exception occurs
     */
    public String[] getBillboardSchedule(String token) throws IOException {
        oos.writeUTF("getScheduleBillboard");
        oos.writeUTF(token);
        oos.flush();

        return (ois.readUTF().split(";"));
    }
}