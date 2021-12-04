package Billboard.server;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

// From Week 7: Data Connectivity Lecture Demo
// Added an extra method at the bottom to combat a bug connection issues.
public class DBConnection {

    /**
     * The singleton instance of the database connection.
     */
    private static Connection instance = null;

    /**
     * Constructor intializes the connection.
     */
    private DBConnection() {
        Properties props = new Properties();
        FileInputStream in = null;
        String db_props = "./src/billboard/server/properties/db.props";
        try {
            in = new FileInputStream(db_props);
            props.load(in);
            in.close();

            // specify the data source, username and password
            String url = props.getProperty("jdbc.url");
            String username = props.getProperty("jdbc.username");
            String password = props.getProperty("jdbc.password");
            String schema = props.getProperty("jdbc.schema");

            // get a connection
            instance = DriverManager.getConnection(url + "/" + schema,
                    username, password);
        } catch (SQLException sqle) {
            System.err.println(sqle);
        } catch (FileNotFoundException fnfe) {
            System.err.println(fnfe);
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    /**
     * Provides global access to the singleton instance of the UrlSet.
     *
     * @return a handle to the singleton instance of the UrlSet.
     */
    public static Connection getInstance() {
        if (instance == null) {
            new DBConnection();
        }
        return instance;
    }

    /**
     * Resets the instance back to null to prevent closed connection errors when
     * attempting to reconnect.
     */
    public static void resetInstance() {
        instance = null;
    }
}