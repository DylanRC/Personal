package Billboard.server;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import Billboard.controlPanel.billboard;

public class databaseCommit {

    public static void setUserPerms(String userName, int[] perms) throws SQLException {
        DBConnection.resetInstance();
        String query = String.format("UPDATE userPermissions SET createBillboards = '%d', editAllBillboards = '%d'," +
                "scheduleBillboards = '%d', editUsers = '%d' WHERE userName = '%s'", perms[0], perms[1], perms[2],
                perms[3], userName);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(query);
        s.close();
        c.close();
    }

    public static void setUserPass(String userName, String salt, String hash) throws SQLException {
        DBConnection.resetInstance();
        String saltQuery = String.format("UPDATE users SET salt = '%s' WHERE userName = '%s'", salt, userName);
        String hashQuery = String.format("UPDATE users SET hash = '%s' WHERE userName = '%s'", hash, userName);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(saltQuery);
        s.executeQuery(hashQuery);
        s.close();
        c.close();
    }

    public static void deleteUser(String userName) throws SQLException {
        DBConnection.resetInstance();
        String userPermsQuery = String.format("DELETE FROM userPermissions WHERE userName = '%s'", userName);
        String userQuery = String.format("DELETE FROM users WHERE userName = '%s'", userName);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(userPermsQuery);
        s.executeQuery(userQuery);
        s.close();
        c.close();
    }

    public static void createUser(String userName, String salt, String hash, int[] perms) throws SQLException {
        DBConnection.resetInstance();
        String userQuery = String.format("INSERT INTO users (userName, salt, hash) VALUES ('%s', '%s', '%s')",
                userName, salt, hash);
        String userPermsQuery = String.format("INSERT INTO userPermissions (userName, createBillboards, " +
                        "editAllBillboards, scheduleBillboards, editUsers) VALUES ('%s', '%d', '%d', '%d', '%d')",
                userName, perms[0], perms[1], perms[2], perms[3]);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(userQuery);
        s.executeQuery(userPermsQuery);
        s.close();
        c.close();
    }

    public static void createBillboard(String userName, billboard newBillboard) throws SQLException {
        DBConnection.resetInstance();
        String Query = String.format("INSERT INTO billboards (userName, billboardID, background, msgColour, msgText, " +
                        "infoColour, infoText, picture) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s')",
                userName, newBillboard.getName(), newBillboard.getBackgroundColour(), newBillboard.getMessageColour(),
                newBillboard.getMessageText(), newBillboard.getInfoColour(), newBillboard.getInfoText(),
                newBillboard.getPicture());
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(Query);
        s.close();
        c.close();
    }

    public static void deleteBillboard(String billboardID) throws SQLException {
        DBConnection.resetInstance();
        String Query = String.format("DELETE FROM billboards WHERE billboardID = '%s'", billboardID);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(Query);
        s.close();
        c.close();
    }

    public static void editBillboard(String userName, billboard newBillboard) throws SQLException {
        DBConnection.resetInstance();
        String Query = String.format("UPDATE billboards SET background = '%s', msgColour = '%s', msgText = '%s', " +
                        "infoColour = '%s', infoText = '%s', picture = '%s' WHERE billboardID = '%s'", newBillboard.getBackgroundColour(),
                newBillboard.getMessageColour(), newBillboard.getMessageText(), newBillboard.getInfoColour(),
                newBillboard.getInfoText(), newBillboard.getPicture(), newBillboard.getName());
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(Query);
        s.close();
        c.close();
    }

    public static void removeBillboard(String billboardID) throws SQLException {
        DBConnection.resetInstance();
        String Query = String.format("DELETE FROM schedules WHERE billboardID = '%s'", billboardID);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(Query);
        s.close();
        c.close();
    }

    public static void scheduleBillboard(String userName, String billboardID, String date, String time, String duration) throws SQLException {
        DBConnection.resetInstance();
        String Query = String.format("INSERT INTO schedules (userName, billboardID, date, time, runtime) VALUES " +
                "('%s', '%s', '%s', '%s', '%s'", userName, billboardID, date, time, duration);
        Connection c = DBConnection.getInstance();
        Statement s = c.createStatement();
        s.executeQuery(Query);
        s.close();
        c.close();
    }
}
