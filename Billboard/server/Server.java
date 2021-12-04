package Billboard.server;

import java.io.IOException;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.Socket;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import Billboard.controlPanel.billboard;

public class Server implements Runnable {
    private Socket socket;
    private String token;
    private String user;

    public Server(Socket socket) {
        this.socket = socket;
    }

    @Override
    public void run() {
        try {
            ObjectInputStream oIS = new ObjectInputStream(socket.getInputStream());
            ObjectOutputStream oOS = new ObjectOutputStream(socket.getOutputStream());
            for(;;) {
                Input(oOS, oIS);
            }
        } catch (SQLException | NoSuchAlgorithmException | ClassNotFoundException e) {
            e.printStackTrace();
        }
        catch (IOException e) {
            System.out.println("Client disconnected...");
        }
    }


    public void Input(ObjectOutputStream oOS, ObjectInputStream oIS) throws IOException, SQLException, NoSuchAlgorithmException, ClassNotFoundException {
        String panelInput = oIS.readUTF();
        if (panelInput.contains("viewerREQ")) {
            String[] request = panelInput.split(";");
            panelInput = request[1];
            System.out.println("Viewer Request: " + panelInput);
        } else System.out.println("Panel Request: " + panelInput);
        switch (panelInput) {
            case "getAllUsers": {
                String sentToken = oIS.readUTF();
                if (sessionToken.checkToken(token, sentToken)) {
                    if (databaseRetrieval.checkPerms(user, "editUsers")) {
                        HashSet<String> userList = databaseRetrieval.listUsers();
                        String users = String.valueOf(userList);
                        String listUsers = users.replaceAll("\\[", "").replaceAll("\\]","");
                        oOS.writeUTF(listUsers);
                    } else oOS.writeUTF("null;You do not have permission for this action");
                } else oOS.writeUTF("null;Session token invalid");

                oOS.flush();
                break;
            }

            case "getUserPerms": {
                String[] inputs = (oIS.readUTF().split(";"));

                if (inputs.length == 2) {
                    String sentToken = inputs[0];
                    String userName = inputs[1];

                    if (sessionToken.checkToken(token, sentToken)) {
                        if (databaseRetrieval.checkUserExists(userName)) {
                            if (databaseRetrieval.checkPerms(user, "editUsers")) {
                                List<String> permsList = databaseRetrieval.listUserPerms(userName);
                                String perms = String.valueOf(permsList);
                                String listPerms = perms.replaceAll("\\[", "").replaceAll("\\]","");
                                System.out.println(listPerms);
                                oOS.writeUTF(listPerms);
                            } else oOS.writeUTF("null;You do not have permission for this action");
                        } else oOS.writeUTF("null;Non-existent user");
                    } else oOS.writeUTF("null;Session token invalid");
                } else oOS.writeUTF("null;Invalid number of arguments");

                oOS.flush();
                break;
            }

            case "setUser": {
                String[] inputs = (oIS.readUTF().split(";"));

                if (inputs.length == 4) {
                    String sentToken = inputs[0];
                    String userName = inputs[1];
                    String sentHash = inputs[2];
                    String[] perms = (inputs[3].split(","));
                    int[] permsArray = new int[4];
                    for (int i = 0; i < perms.length; i++) {
                        permsArray[i] = Integer.parseInt(perms[i]);
                    }

                    if (sessionToken.checkToken(token, sentToken)) {
                        if (databaseRetrieval.checkUserExists(userName)) {
                            if (databaseRetrieval.checkPerms(user, "editUsers")) {
                                if (!inputs[2].equals("null") && !inputs[3].equals("null")) {
                                    String salt = passEncryption.saltShaker();
                                    String storedHash = passEncryption.hashToSalt(sentHash, salt);
                                    databaseCommit.setUserPass(userName, salt, storedHash);
                                    databaseCommit.setUserPerms(userName, permsArray);
                                    oOS.writeUTF("User updated successfully");
                                } else oOS.writeUTF("null;Password or permissions not found");
                            } else oOS.writeUTF("null;You do not have permission for this action");
                        } else oOS.writeUTF("null;Non-existent user");
                    } else oOS.writeUTF("null;Session token invalid");
                } else oOS.writeUTF("null;Invalid number of arguments");
                oOS.flush();
                break;
            }

            case "setUserPass": {
                String[] inputs = (oIS.readUTF().split(";"));

                if (inputs.length == 2) {
                    String sentToken = inputs[0];
                    String sentHash = inputs[1];
                    if (sessionToken.checkToken(token, sentToken)) {
                        String salt = passEncryption.saltShaker();
                        String storedHash = passEncryption.hashToSalt(sentHash, salt);
                        databaseCommit.setUserPass(user, salt, storedHash);
                    } else oOS.writeUTF("null;Session token invalid");
                } else oOS.writeUTF("null;Invalid number of arguments");

                oOS.writeUTF("User password updated successfully.");
                oOS.flush();
                break;
            }

            case "deleteUser": {
                String[] inputs = (oIS.readUTF().split(";"));

                if (inputs.length == 2) {
                    String sentToken = inputs[0];
                    String userName = inputs[1];
                    if (sessionToken.checkToken(token, sentToken)) {
                        if (databaseRetrieval.checkUserExists(userName)) {
                            if (databaseRetrieval.checkPerms(user, "editUsers")) {
                                if (!user.equals(userName)) {
                                    databaseCommit.deleteUser(userName);
                                    oOS.writeUTF("User deleted successfully.");
                                } else oOS.writeUTF("null;User can not delete their own instance");
                            } else oOS.writeUTF("null;You do not have permission for this action");
                        } else oOS.writeUTF("null;Non-existent user");
                    } else oOS.writeUTF("null;Session token invalid");
                } else oOS.writeUTF("null;Invalid number of arguments");

                oOS.flush();
                break;
            }

            case "createUser": {
                String[] inputs = (oIS.readUTF().split(";"));

                if (inputs.length == 4) {
                    String sentToken = inputs[0];
                    String userName = inputs[1];
                    String sentHash = inputs[2];
                    String[] perms = (inputs[3].split(","));
                    int[] permsArray = new int[4];
                    for (int i = 0; i < perms.length; i++) {
                        permsArray[i] = Integer.parseInt(perms[i]);
                    }
                    if (sessionToken.checkToken(token, sentToken)) {
                        if (!databaseRetrieval.checkUserExists(userName)) {
                            if (databaseRetrieval.checkPerms(user, "editUsers")) {
                                String salt = passEncryption.saltShaker();
                                String storedHash = passEncryption.hashToSalt(sentHash, salt);
                                databaseCommit.createUser(userName, salt, storedHash, permsArray);
                            } else oOS.writeUTF("null;You do not have permission for this action");
                        } else oOS.writeUTF("null;User already exists");
                    } else oOS.writeUTF("null;Session token invalid");
                } else oOS.writeUTF("null;Invalid number of arguments");

                oOS.writeUTF("User created and committed successfully.");
                oOS.flush();
                break;
            }

            case "loginRequest": {
                String[] inputs = (oIS.readUTF().split(";"));
                System.out.println(Arrays.toString(inputs));
                if ((inputs.length == 2)) {
                    String userName = inputs[0];
                    String hash = inputs[1];
                    user = userName;

                    if (!(inputs[0].isEmpty()) && !(inputs[1].contains("null"))) {

                        if (databaseRetrieval.checkUserExists(userName)) {
                            String userToken = databaseRetrieval.loginRequest(userName, hash);

                            if (!userToken.startsWith("null")) token = userToken;
                            oOS.writeUTF(userToken);


                        } else oOS.writeUTF("null;Non-existent user");

                    } else oOS.writeUTF("null;Incomplete form");
                } else oOS.writeUTF("null; Invalid arguments");
                oOS.flush();
                break;
            }

            case "getAllBillboards": {
                String sentToken = oIS.readUTF();
                if (sessionToken.checkToken(token, sentToken)) {
                    HashSet<String> billboardList = databaseRetrieval.listAllBillboards();
                    String billboards = String.valueOf(billboardList);
                    String listBillboards = billboards.replaceAll("\\[", "").replaceAll("\\]","");
                    oOS.writeUTF(listBillboards);
                } else oOS.writeUTF("null;Session token invalid");

                oOS.flush();
                break;
            }

            case "setBillboard": {
                String sentToken = oIS.readUTF();
                billboard newBillboard = (billboard) oIS.readObject();
                if (sessionToken.checkToken(token, sentToken)) {
                    if (databaseRetrieval.checkPerms(user, "createBillboards")) {
                        if (!databaseRetrieval.checkBillboardExists(newBillboard.getName())) {
                            databaseCommit.createBillboard(user, newBillboard);
                            oOS.writeUTF("Billboard created and committed successfully");
                        }

                        else {
                            if (databaseRetrieval.checkBillboardOwner(user, newBillboard.getName())) {
                                databaseCommit.editBillboard(user, newBillboard);
                                oOS.writeUTF("Billboard edited and committed successfully");
                            }
                        }
                    }
                    else if (databaseRetrieval.checkPerms(user, "editAllBillboards")) {
                        if (!databaseRetrieval.checkBillboardExists(newBillboard.getName())) {
                            databaseCommit.createBillboard(user, newBillboard);
                            oOS.writeUTF("Billboard created and committed successfully");
                        }

                        else {
                                databaseCommit.editBillboard(user, newBillboard);
                                oOS.writeUTF("Billboard edited and committed successfully");
                        }
                    } else oOS.writeUTF("null;You do not have permission for this action");
                } else oOS.writeUTF("null;Session token invalid");

                oOS.flush();
                break;
            }

            case "deleteBillboard": {
                String[] inputs = oIS.readUTF().split(";");
                if (inputs.length == 2) {
                    String sentToken = inputs[0];
                    String billboardID = inputs[1];

                    if (sessionToken.checkToken(token, sentToken)) {

                        if (databaseRetrieval.checkPerms(user, "editAllBillboards")) {
                            if (databaseRetrieval.checkBillboardExists(billboardID)) {
                                databaseCommit.deleteBillboard(billboardID);
                                oOS.writeUTF("Billboard deleted successfully");
                            }
                        }

                        else if (databaseRetrieval.checkPerms(user, "createBillboards")) {
                            if (databaseRetrieval.checkBillboardExists(billboardID)) {
                                if (databaseRetrieval.checkBillboardOwner(user, billboardID)) {
                                    databaseCommit.deleteBillboard(billboardID);
                                    oOS.writeUTF("Billboard deleted successfully");
                                } else oOS.writeUTF("null;You do not have permission for this action");

                            } else oOS.writeUTF("null;Billboard does not exist");
                        } else oOS.writeUTF("null;You do not have permission for this action");
                    } else oOS.writeUTF("null;Session token invalid");
                } else oOS.writeUTF("null;Invalid number of arguments");

                oOS.flush();
                break;
            }

            case "getBillboard": {
                String[] inputs = oIS.readUTF().split(";");
                if (inputs.length == 2) {
                    String sentToken = inputs[0];
                    String billboardID = inputs[1];
                    if (sessionToken.checkToken(token, sentToken)) { ;
                        if (databaseRetrieval.checkBillboardExists(billboardID)) {
                            Object billboardData = databaseRetrieval.getBillboard(billboardID);
                            oOS.writeObject(billboardData);
                        } else oOS.writeObject("null;Billboard does not exist");
                    } else oOS.writeObject("null;Session token invalid");
                } else oOS.writeObject("null;Invalid number of arguments");

                oOS.flush();
                break;
            }

            case "viewSchedule": {
                String sentToken = oIS.readUTF();
                if (sessionToken.checkToken(token, sentToken)) {
                    if (databaseRetrieval.checkPerms(user, "scheduleBillboards")) {
                        String[][] scheduleList = databaseRetrieval.getSchedule();
                        oOS.writeObject(scheduleList);
                    } else oOS.writeUTF("null;You do not have permission for this action");
                } else oOS.writeUTF("null;Session token invalid");

                oOS.flush();
                break;
            }

            case "scheduleBillboard": {
                String[] inputs = oIS.readUTF().split(";");
                if (inputs.length == 4) {
                    String sentToken = inputs[0];
                    String billboardID = inputs[1];
                    String time = inputs[2];
                    String duration = inputs[3];
                    Date date = new Date();
                    SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
                    String billboardDate = formatter.format(date);

                    if (sessionToken.checkToken(token, sentToken)) {
                        if (databaseRetrieval.checkPerms(user, "scheduleBillboards")) {
                            databaseCommit.scheduleBillboard(user, billboardID, billboardDate, time, duration);

                        } else oOS.writeUTF("null;You do not have permission for this action");
                    } else oOS.writeUTF("null;Session token invalid");
                } else oOS.writeUTF("null;Invalid number of arguments");
            }

            case "removeBillboard": {
                String[] inputs = oIS.readUTF().split(";");

                if (inputs.length == 2) {
                    String sentToken = inputs[0];
                    String billboardID = inputs[1];

                    if (sessionToken.checkToken(token, sentToken)) {
                        if (databaseRetrieval.checkPerms(user, "scheduleBillboards")) {
                            if (databaseRetrieval.checkScheduleExists(billboardID)) {
                                databaseCommit.removeBillboard(billboardID);
                                oOS.writeUTF("Billboard removed from schedule");
                            } else oOS.writeUTF("null; Schedule does not exist");
                        } else oOS.writeUTF("null;You do not have permission for this action");
                    } else oOS.writeUTF("null;Session token invalid");
                }
                oOS.flush();
                break;
            }

            case "getXML": {
                oOS.writeUTF("Server Test");
                oOS.flush();
                break;
            }
        }
    }
}
