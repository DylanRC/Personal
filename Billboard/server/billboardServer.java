package Billboard.server;

import java.io.*;
import java.net.ServerSocket;
import java.net.Socket;
import java.net.SocketException;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.List;
import java.util.Properties;

public class billboardServer {
    private String token;
    private String user;

    public static void main(String[] args) throws IOException, SQLException, ClassNotFoundException {
        final String server_props = "./src/billboard/server/properties/server.props";
        final String db_init = "../../src/billboard/server/properties/initialise.sql";

        InputStream fS = new FileInputStream(server_props);
        Properties props = new Properties();
        props.load(fS);
        int serverPort = Integer.parseInt(props.getProperty("server.port"));

            try (Connection c = DBConnection.getInstance()) {
                c.close();
                DBConnection.resetInstance(); // Implemented to stop a bug where no further connections could be made
                System.out.println("Verified connection to Database... \nStarting server...\n");

                try (ServerSocket sS = new ServerSocket(serverPort)) {
                    System.out.format("Server Online, Listening on Port %s\n", serverPort);
                    for (;;) {
                        Socket socket = sS.accept();
                        new Thread(new Server(socket)).start();
                    }
                }
            }

            catch (SQLException e) {
                System.err.println(e);
            }
        }
    }
