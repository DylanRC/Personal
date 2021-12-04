package Billboard.server;

import java.io.*;
import java.net.Socket;
import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Properties;

public class TestClient {
    public static void main(String[] args) throws IOException, ClassNotFoundException, NoSuchAlgorithmException, SQLException {
        final String server_props = "./src/billboard/server/properties/server.props";
        InputStream fS = new FileInputStream(server_props);
        Properties props = new Properties();
        props.load(fS);
        final String serverHost = props.getProperty("server.host");
        final int serverPort = Integer.parseInt(props.getProperty("server.port"));

        Socket soc = new Socket("localhost", 1024);
        ObjectInputStream oIS = new ObjectInputStream(soc.getInputStream());
        ObjectOutputStream oOS = new ObjectOutputStream(soc.getOutputStream());

        // List Users //
        oOS.writeUTF("listUsers");
        oOS.flush();
        Object userList = oIS.readObject();
        System.out.println(userList);

//        // List User Perms //
//        oOS.writeUTF("getUserPerms");
//        oOS.writeUTF("admin");
//        oOS.flush();
//        Object permsList = oIS.readObject();
//        System.out.println(permsList);

//        // Set User Perms //
//        int[] perms = {1, 0, 0, 1};
//        oOS.writeUTF("setUserPerms");
//        oOS.writeUTF("admin");
//        oOS.writeObject(perms);
//        oOS.flush();
//        System.out.println(oIS.readUTF());

//        // Set User Pass //
//        int[] perms = {1, 1, 1, 1};
//        oOS.writeUTF("setUserPerms");
//        oOS.writeUTF("admin");
//        oOS.writeObject(perms);
//        oOS.flush();
//        System.out.println(oIS.readUTF());

//        // Delete User //
//        oOS.writeUTF("deleteUser");
//        oOS.writeUTF("admin");
//        oOS.flush();
//        System.out.println(oIS.readUTF());

//        // Create User //
//        String userName = "admin";
//        int[] perms = {1, 1, 1, 1};

//        String pass = "CAB302";
//        byte[] passBytes = passEncryption.toBytes(pass); // Converts to bytes
//        String hashedPass = passEncryption.bytesToString(passBytes); // This will be sent and tested with salt in any auth
//        System.out.println(hashedPass);
//        String salt = passEncryption.saltShaker();  // Salt stored in database
//        String storedHash = passEncryption.hashToSalt(hashedPass, salt); // Hash stored in database to compare

//        oOS.writeUTF("createUser");
//        oOS.writeUTF(userName);
//        oOS.writeUTF(salt);
//        oOS.writeUTF(storedHash);
//        oOS.writeObject(perms);
//        oOS.flush();
//        System.out.println(oIS.readUTF());

//        // Session tester //
//        String token = sessionToken.newToken();
//        String tokenExpiry = sessionToken.tokenExpiry();
//
//        HashMap<String, String> userToken = sessionToken.establishToken(token, tokenExpiry);
//        System.out.println(userToken.get("tokenStr"));

//        // Login Request //
//        oOS.writeUTF("loginRequest");
//        oOS.writeUTF("admin");
//        oOS.writeUTF(hashedPass);
//        oOS.flush();
//        Object userToken = oIS.readObject();
//        System.out.println(userToken);

//        String[] perms = (inputs[2].split(","));
//        int[] permsArray = new int[4];
//        for (int i = 0; i < perms.length; i++) {
//            permsArray[i] = Integer.parseInt(perms[i]);
//        }

        oIS.close();
        oOS.close();
        soc.close();
    }
}
