package Billboard.server;

import java.security.NoSuchAlgorithmException;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.*;
import Billboard.controlPanel.billboard;
import javax.print.DocFlavor;

public class databaseRetrieval {

    public static HashSet<String> listUsers() throws SQLException {
        DBConnection.resetInstance();
        HashSet<String> userList = new HashSet<>(Collections.emptyList());
        String query = "SELECT userName FROM users";
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r = s.executeQuery(query);
        while (r.next()) {
            userList.add(r.getString(1));
        }
        s.close();
        c.close();
        return userList;
    }

    public static boolean checkUserExists(String userName) {
        try {
            DBConnection.resetInstance();
            String query = String.format("SELECT userName FROM users WHERE userName = '%s'",
                    userName);
            Connection c = DBConnection.getInstance();
            Statement s = c.createStatement();
            ResultSet r = s.executeQuery(query);
            r.next();
            if (r.getString(1).equals(userName)) {
                s.close();
                c.close();
                return true;
            }
            else {
                s.close();
                c.close();
                return false;
            }
        }
        catch (SQLException e) {
            System.err.println(e);
            return false;
        }
    }

    public static boolean checkBillboardExists(String billboardID) {
        try {
            DBConnection.resetInstance();
            String query = String.format("SELECT billboardID FROM billboards WHERE billboardID = '%s'",
                    billboardID);
            Connection c = DBConnection.getInstance();
            Statement s = c.createStatement();
            ResultSet r = s.executeQuery(query);
            r.next();
            try {
                if (r.getString(1).contains(billboardID)) {
                    r.close();
                    s.close();
                    c.close();
                    return true;
                } else {
                    r.close();
                    s.close();
                    c.close();
                    return false;
                }
            }
            catch (SQLException e) {
                r.close();
                s.close();
                c.close();
                return false;
            }
        }
        catch (SQLException e) {
            System.out.println(e);
            return false;
        }
    }

    public static boolean checkScheduleExists(String billboardID) throws SQLException {
        DBConnection.resetInstance();
        String query = String.format("SELECT billboardID FROM schedules WHERE billboardID = '%s'",
                billboardID);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r = s.executeQuery(query);
        r.next();
        if (r.getString(1).equals(billboardID)) {
            s.close();
            c.close();
            return true;
        }
        else {
            s.close();
            c.close();
            return false;
        }
    }

    public static boolean checkBillboardOwner(String user, String billboardID) throws SQLException {
        DBConnection.resetInstance();
        String query = String.format("SELECT userName FROM billboards WHERE billboardID = '%s'",
                billboardID);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r = s.executeQuery(query);
        r.next();
        if (r.getString(1).equals(user)) {
            s.close();
            c.close();
            return true;
        }
        else {
            s.close();
            c.close();
            return false;
        }
    }

    public static billboard getBillboard(String billboardID) throws SQLException {
        DBConnection.resetInstance();
        billboard billboardData = new billboard();
        String query = String.format("SELECT * FROM billboards WHERE billboardID = '%s'",
                billboardID);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r = s.executeQuery(query);
        r.next();

        billboardData.setName(billboardID);
        billboardData.setBackgroundColour(r.getString(3));
        billboardData.setMessageColour(r.getString(4));
        billboardData.setMessageText(r.getString(5));
        billboardData.setInfoColour(r.getString(6));
        billboardData.setInfoText(r.getString(7));
        billboardData.setPicture(r.getString(8));

        return billboardData;
    }

    /**
     * Retrieves a list of the specified user's permissions from the database. Any permission returned from the
     * database with a true value are added to the list. Otherwise
     *
     * @param userName - The user being queried for the permission check.
     * @return a list containing all of the user's permissions.
     * @throws SQLException if unable to find user in database.
     */
    public static List<String> listUserPerms(String userName) throws SQLException {
        DBConnection.resetInstance();
        List<String> userPerms = new ArrayList<String>();
        String[] permNames = {"createBillboards", "editAllBillboards", "scheduleBillboards", "editUsers"};
        String query = String.format("SELECT * FROM userPermissions WHERE userName = '%s'", userName);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r = s.executeQuery(query);
        r.next();
        for (int i = 2; i <= 5; i++) { ;
            if (r.getBoolean(i)) {
                userPerms.add(permNames[i - 2]);
            }
        }
        s.close();
        c.close();
        return userPerms;
    }

    /**
     * Checks against the database to ensure the queried user's password is correct. The database retrieves the stored
     * hash and salt under the queried username and then salts the supplied password hash. Once the supplied
     * password hash has been salted using the stored salt, if it is equal to the stored hash then the password is
     * correct and the user is successfully authenticated.
     *
     * @param userName - The user being queried for the permission check.
     * @param hash - Hashed version of the submitted password to be salted and compared against the stored hash.
     * @return boolean value indicating whether or not the user is authorised for the selected permission.
     * @throws SQLException if unable to find user in database.
     * @throws NoSuchAlgorithmException if the algorithm in the hashToSalt method doesn't exist.
     */
    public static String loginRequest(String userName, String hash) throws SQLException, NoSuchAlgorithmException {
        DBConnection.resetInstance();
        String query = String.format("SELECT * FROM users WHERE userName = '%s'", userName);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r = s.executeQuery(query);
        r.next();
        String salt = r.getString(2);
        String storedHash = r.getString(3);
        s.close();
        c.close();

        String userHash = passEncryption.hashToSalt(hash, salt);
        if (storedHash.equals(userHash)) {
            String token = sessionToken.newToken();
            return token;
        } else return "null;Password is incorrect";

//        String userHash = passEncryption.hashToSalt(hash, salt);
//        if (storedHash.equals(userHash)) {
//            String token = sessionToken.newToken();
//            String tokenExpiry = sessionToken.tokenExpiry();
//
//            return sessionToken.establishToken(token, tokenExpiry);
//        }
//        else {
//            return sessionToken.establishToken(null, null);
//        }
    }

    public static HashSet<String> listAllBillboards() throws SQLException {
        DBConnection.resetInstance();
        HashSet<String> billboardList = new HashSet<>(Collections.emptyList());
        String query = "SELECT billboardID FROM billboards";
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r = s.executeQuery(query);
        while (r.next()) {
            billboardList.add(r.getString(1));
        }
        s.close();
        c.close();
        return billboardList;
    }

    public static String[][] getSchedule() throws SQLException {
        DBConnection.resetInstance();
        String query1 = "SELECT COUNT(*) FROM schedules";
        String query2 = "SELECT * FROM schedules";
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        ResultSet r1 = s.executeQuery(query1);
        ResultSet r2 = s.executeQuery(query2);
        r1.next();
        int num_rows = r1.getInt(1);
        String[][] scheduleList = new String[num_rows][5];
        r1.close();
        r2.next();
        for (int i = 0; i < num_rows; i++) {
            for (int j = 0; j < 5; j++) {
                scheduleList[i][j] = r2.getString(j+1);
            }
            r2.next();
        }
        s.close();
        c.close();
        return scheduleList;
    }

    /**
     * Checks against the database to verify the queried user has the specified permission.
     *
     * @param userName - The user being queried for the permission check.
     * @return boolean value indicating whether or not the user is authorised for the selected permission.
     * @throws SQLException if unable to find user in database.
     */
    public static boolean checkPerms(String userName, String permission) throws SQLException {
        List<String> userPerms = listUserPerms(userName);
        String permsList = String.valueOf(userPerms);
        if(permsList.contains(permission)) {
            return true;
        }
        else return false;
    }

//            DBConnection.resetInstance();
//    String permissionQuery = String.format("SELECT '%s' from userPermissions WHERE userName = '%s'",
//            permission, userName);
//    Connection c = DBConnection.getInstance();
//    Statement s = c.createStatement();
//    ResultSet r = s.executeQuery(permissionQuery);
//        r.next();
//    boolean authorised = r.getBoolean(1);
//        s.close();
//        c.close();
//        return authorised;
}
