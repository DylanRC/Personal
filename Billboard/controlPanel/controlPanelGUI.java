package Billboard.controlPanel;

import javax.swing.*;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.*;
import java.security.NoSuchAlgorithmException;

/**
 * This class is responsible for creating the Control Panel GUI seen by the user.
 */
public class controlPanelGUI {
    private int windowX;
    private int windowY;
    private int scale; //Based on a default size of 1920/1080
    private commonGUIElements common;
    private serverCommunication server;
    private String token;
    private JFrame window;
    private String currentUser;

    /**
     * Constructor to set up the appropriately formatted control panel to be displayed.
     * @throws IOException If an input or output exception occurs
     */
    public controlPanelGUI() throws IOException {
        //Getting the dimensions of the screen
        Dimension screenSize = Toolkit.getDefaultToolkit().getScreenSize();
        int width = (int) screenSize.getWidth();

        //Setting the window dimensions and the scale based on screen dimensions
        windowX = width / 2;
        windowY = (int) Math.round(windowX/(16.0/9.0));
        scale = (int) Math.round(1920.0/width);
        common = new commonGUIElements(windowX, windowY, scale);

        //Setting up the connection to the server
        server = new serverCommunication();
    }

    /**
     * Generates the initial window and login UI upon startup of the control panel.
     * This window prompts a user to input their username and password in order to login to the server. If the
     * username or password is unknown to the system, or required entries have not been input, the user will not be
     * granted login and an exception indicating the cause of the problem will be displayed.
     */
    public void generateLoginUI() {
        //Setting up the frame
        JFrame window = common.setupWindow();

        //Creating the display panel
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(null);
        window.add(mainPanel);

        //Creating the header
        JLabel header = new JLabel("Login Page");
        mainPanel.add(header);
        header.setBounds((windowX/2)-(88*scale), 30*scale, 176*scale, 40*scale);
        header.setFont(new Font("Arial", Font.BOLD, 30*scale));

        //Creating the username field and its respective label
        JLabel usernameLabel = new JLabel("Username:");
        JTextField username = new JTextField();
        mainPanel.add(usernameLabel);
        mainPanel.add(username);
        usernameLabel.setBounds((windowX/2)-(100*scale), (windowY/2)-(75*scale), 200*scale, 25*scale);
        usernameLabel.setFont(new Font("Arial", Font.BOLD, 15*scale));
        username.setBounds((windowX/2)-(100*scale), (windowY/2)-(50*scale), 200*scale, 25*scale);

        //Creating the password field and its respective label
        JLabel passwordLabel = new JLabel("Password:");
        JPasswordField password = new JPasswordField();
        mainPanel.add(passwordLabel);
        mainPanel.add(password);
        passwordLabel.setBounds((windowX/2)-(100*scale), (windowY/2)-(10*scale), 200*scale, 25*scale);
        passwordLabel.setFont(new Font("Arial", Font.BOLD, 15*scale));
        password.setBounds((windowX/2)-(100*scale), (windowY/2)+(15*scale), 200*scale, 25*scale);

        //Creating the submit button
        JButton submit = new JButton("Login");
        mainPanel.add(submit);
        submit.setBounds((windowX/2)-(100*scale), (windowY/2)+(50*scale), 200*scale, 25*scale);

        //Submitting the login information to the server on submit press
        submit.addActionListener(e -> {
            String usernameValue = username.getText();
            String passwordValue = new String(password.getPassword());

            try {
                String[] input = server.login(usernameValue, passwordValue);

                //If there was an error print the error message
                if (input[0].equals("null")) {
                    JOptionPane.showMessageDialog(window, input[1]);
                    username.setText("");
                    password.setText("");
                }

                //If authentication is successful
                else {
                    token = input[0];

                    generateMainPage(usernameValue, 0);
                    currentUser = usernameValue;
                    window.dispose();
                }

            } catch (IOException | NoSuchAlgorithmException ex) {
                ex.printStackTrace();
            }
        });
    }

    /**
     * Generates a new window which contains a tabbed pane. The tabbed pane holds all of the pages which can be
     * accessed via the tabs listed across the control panel 'navigation' bar.
     * @param user The current user
     * @param selectedTab The tab the user was on before window refresh
     * @throws IOException If an input or output exception occurs
     */
    public void generateMainPage(String user, int selectedTab) throws IOException {
        //Setting up the window
        window = common.setupWindow();

        JTabbedPane mainPage = new JTabbedPane();
        window.add(mainPage);

//        JPanel test = new JPanel();
//        mainPage.add("Text", test);

        //Generating the List Billboards page
        JPanel listBillboards = generateListBillboards();
        mainPage.add("Billboards", listBillboards);

        //Generating the Schedule Billboards page
        JPanel scheduleBillboards = generateScheduleBillboard();
        mainPage.add("Schedule Billboards", scheduleBillboards);

        //Generating the Edit Users or Change Pass Page depending on perms
        String[] input = (server.getPermissions(token, user));
        JPanel editUsers = generateEditUsers();
        if (input[0].contains("editUsers")) {
            mainPage.add("Edit Users", editUsers);
        }
        else {
            mainPage.add("Change Password", editUsers);
        }

        if (selectedTab == 0) {
            mainPage.setSelectedIndex(0);
        }
        else {
            mainPage.setSelectedIndex(2);
        }
    }

    /**
     * Creates the dialog window of the billboard editor, responsible for creating or editing a billboard.
     * Once submitted, the information will be sent to the server where it will then be redisplayed in the control
     * panel with the appropriate changes or return an appropriate error message.
     * @param edit The boolean value determining whether the billboard is being created, or edited
     * @param billboardName The name of the billboard being edited
     * @throws IOException If an input or output exception occurs
     * @throws ClassNotFoundException If a class loaded at runtime could not be found in the classpath
     */
    private void generateBillboardEditor(boolean edit, String billboardName) throws IOException, ClassNotFoundException {
        //Instantiating a new billboard
        billboard newBillboard = new billboard();

        if (edit) {
            //Getting the billboard's information from the server
            Object value = server.getBillboard(token, billboardName);

            if (value instanceof String) {
                String[] error = ((String) value).split(";");
                JOptionPane.showMessageDialog(new Frame(), error[1]);
                return;
            }

            //Instantiating the billboard that was retrieved from the server
            newBillboard = (billboard) value;
        }

        JDialog billboardWindow = common.setupDialog(windowX, windowY, "Billboard Editor");

        JPanel billboardEditor = new JPanel();
        billboardWindow.add(billboardEditor);
        billboardEditor.setLayout(null);

        //Creating the name field and its respective label
        JPanel name = common.setupLabeledField((windowX/2)-(100*scale), 15*scale,"Billboard Name:");
        billboardEditor.add(name);
        if (edit) {
            common.getTextField(name).setText(billboardName);
            common.getTextField(name).setEnabled(false);
        }

        //Creating the message field and its respective label
        JPanel message = common.setupLabeledField((windowX/2)-(220*scale), 75*scale, "Message:");
        billboardEditor.add(message);

        //Creating the message colour field and its respective label
        JPanel messageColour = common.setupLabeledField((windowX/2)+(20*scale), 75*scale, "Message Colour:");
        billboardEditor.add(messageColour);

        //Creating the information field and its respective label
        JPanel information = common.setupLabeledField((windowX/2)-(220*scale), 135*scale, "Information:");
        billboardEditor.add(information);

        //Creating the information colour field and its respective label
        JPanel informationColour = common.setupLabeledField((windowX/2)+(20*scale), 135*scale, "Information Colour:");
        billboardEditor.add(informationColour);

        //Creating the information field and its respective label
        JPanel background = common.setupLabeledField((windowX/2)-(220*scale), 195*scale, "Background Colour:");
        billboardEditor.add(background);

        //Creating the information colour field and its respective label
        JPanel picture = common.setupLabeledField((windowX/2)+(20*scale), 195*scale, "Picture (URL/Data):");
        billboardEditor.add(picture);

        //Creating the auto-fill with XML button
        JButton xml = new JButton("Auto-Fill with XML");
        billboardEditor.add(xml);
        xml.setBounds((windowX/2)-(220*scale), 270*scale, 200*scale, 25*scale);

        //Creating the preview button
        JButton preview = new JButton("Preview Billboard");
        billboardEditor.add(preview);
        preview.setBounds((windowX/2)+(20*scale), 270*scale, 200*scale, 25*scale);

        //Creating the submit button
        JButton submit = new JButton();
        billboardEditor.add(submit);
        if (edit) {
            submit.setText("Update");
            submit.setBounds((windowX/2)-(220*scale), 320*scale, 200*scale, 25*scale);
        }
        else {
            submit.setText("Submit");
            submit.setBounds((windowX/2)-(100*scale), 320*scale, 200*scale, 25*scale);
        }

        if (edit) {
            //Creating the delete button
            JButton delete = new JButton("Delete Billboard");
            billboardEditor.add(delete);
            delete.setBounds((windowX / 2) + (20 * scale), 320 * scale, 200 * scale, 25 * scale);

            //delete button action listener
            delete.addActionListener(e -> {
                //Tell the server to delete the billboard
                try {
                    String[] input = server.deleteBillboard(token, billboardName);

                    //Drop window
                    if (!input[0].equals("null")) {
                        JOptionPane.showMessageDialog(new Frame(), input[0]);
                        window.dispose();
                        generateMainPage(currentUser, 0);
                        billboardWindow.dispose();

                        //If it there was an error display it
                    } else {
                        JOptionPane.showMessageDialog(new Frame(), input[1]);
                    }

                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            });
        }

        //Auto-filling the form if it is of type edit
        if (edit) {
            common.getTextField(message).setText(newBillboard.getMessageText());
            common.getTextField(messageColour).setText(newBillboard.getMessageColour());
            common.getTextField(information).setText(newBillboard.getInfoText());
            common.getTextField(informationColour).setText(newBillboard.getInfoColour());
            common.getTextField(background).setText(newBillboard.getBackgroundColour());
            common.getTextField(picture).setText(newBillboard.getPicture());
        }

        //xml button listener
        xml.addActionListener(e -> {
            //Displaying a file chooser
            FileDialog fd = new FileDialog(new Frame(), "Choose a file", FileDialog.LOAD);
            fd.setDirectory("C:\\");
            fd.setFile("*.xml");
            fd.setVisible(true);
            String filename = fd.getFile();

            //Setting the values of the billboard based on the xml

        });

        //preview button listener
        preview.addActionListener(e -> previewBillboard());

        //submit button listener
        billboard finalNewBillboard = newBillboard;
        submit.addActionListener(e -> {
            //Setting each of the attributes in the billboard object
            finalNewBillboard.setName(common.getTextField(name).getText());
            finalNewBillboard.setMessageText(common.getTextField(message).getText());
            finalNewBillboard.setMessageColour(common.getTextField(messageColour).getText());
            finalNewBillboard.setInfoText(common.getTextField(information).getText());
            finalNewBillboard.setInfoColour(common.getTextField(informationColour).getText());
            finalNewBillboard.setBackgroundColour(common.getTextField(background).getText());
            finalNewBillboard.setPicture(common.getTextField(picture).getText());

            //Sends the billboard to the server
            try {
                String[] input = server.setBillboard(token, finalNewBillboard);

                //If the billboard was created/edited successfully
                if (!input[0].equals("null")) {
                    JOptionPane.showMessageDialog(new Frame(), input[0]);
                    window.dispose();
                    generateMainPage(currentUser, 0);
                    billboardWindow.dispose();

                } else {
                    JOptionPane.showMessageDialog(new Frame(), input[1]);
                }

            } catch (IOException ex) {
                ex.printStackTrace();
            }

        });

        billboardWindow.setVisible(true);
    }

    /**
     * This functions purpose is to preview the edited or created billboard.
     */
    private void previewBillboard() {
        JDialog previewWindow = common.setupDialog(windowX, windowY, "Billboard Previewer");
        previewWindow.setLayout(null);

        previewWindow.setVisible(true);
    }

    /**
     * Generates the list of billboards page. In this page the user can see a list of all the billboards in the system
     * and is able to create or edit a billboard. There is also a logout button to logout of the control panel if so
     * desired.
     * @return The JPanel containing all of the components used to display the list of billboards
     * @throws IOException If an input or output exception occurs
     */
    private JPanel generateListBillboards() throws IOException {
        String[] input = server.getAllBillboards(token);

        JPanel listBillboards = new JPanel();
        listBillboards.setLayout(null);

        if (!input[0].equals("null")) {
            String[] billboards = (input[0].split(","));

            //Label for the list of billboards
            JLabel billboardLabel = new JLabel("<HTML><U>Billboards</U></HTML>");
            listBillboards.add(billboardLabel);
            billboardLabel.setBounds((windowX / 2) - (100 * scale), 20 * scale, 200 * scale, 25 * scale);
            billboardLabel.setFont(new Font("Arial", Font.BOLD, 20 * scale));
            billboardLabel.setHorizontalAlignment(SwingConstants.CENTER);

            // "Logout User" button
            JButton logoutUser = new JButton("Logout");
            listBillboards.add(logoutUser);
            logoutUser.setBounds((windowX)-(100*scale), 5 * scale, 80 * scale, 25 * scale);

            //"Create Billboard" button
            JButton createBillboard = new JButton("Create Billboard");
            listBillboards.add(createBillboard);
            createBillboard.setBounds((windowX / 2) - (100 * scale), 55 * scale, 200 * scale, 25 * scale);

            //Setting up the scroll pane for billboardList
            JScrollPane listScroller = new JScrollPane();
            listBillboards.add(listScroller);
            listScroller.setBounds((windowX / 2) - (windowX / 3), 90 * scale, ((int) (windowX / 1.5)), ((int) (windowY / 1.7)));

            //Displays the list of billboards
            JList billboardList = common.list(billboards, (int) (listScroller.getWidth() / 2.1));
            listScroller.setViewportView(billboardList);

            // Listener for logoutUser
            logoutUser.addActionListener(e -> {
                for (Frame frame : Frame.getFrames()) {
                    frame.dispose();
                }
                generateLoginUI();
            });

            //Listener for createBillboard
            createBillboard.addActionListener(e -> {
                try {
                    //Opens up the billboard editor in create mode
                    generateBillboardEditor(false, null);

                } catch (IOException | ClassNotFoundException ex) {
                    ex.printStackTrace();
                }
            });

            //Listener for when a user is doubled clicked
            billboardList.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    if (e.getClickCount() == 2) {
                        String selectedValue = ((String) billboardList.getSelectedValue()).trim();
                        System.err.println(selectedValue);

                        try {
                            //Opens up the billboard editor in edit mode
                            generateBillboardEditor(true, selectedValue);

                        } catch (IOException | ClassNotFoundException ex) {
                            ex.printStackTrace();
                        }
                    }
                }
            });
        }

        else {
            common.generateWarning(input[1]);
        }

        return listBillboards;
    }

    /**
     * Displays the page containing the 'calender' view and the affiliating data of all scheduled billboards.
     * Additionally it allows the scheduling of a billboard.
     * @return The JPanel which contains the components used to display scheduled billboards
     */
    private JPanel generateScheduleBillboard() {
        // Headers of the JTable
        String[] columns = new String[] {"Billboard Name", "Username", "Day", "Time", "Duration(m)", "Recursion"};

        // Mock data for the JTable in a 2d array
        Object[][] data = new Object[][] {
                {"Billboard1", "Thomas", "Tue", "4:00", "40", "4"},
                {"Billboard5", "JamesHopskin", "Thur", "16:00", "300", "2"},
                {"Billboard2", "Morgan35", "Sat", "8:00", "1080", "1"}
        };

        JPanel scheduleBillboard = new JPanel();
        scheduleBillboard.setLayout(null);

        // Label for the billboards scheduled
        JLabel billboardsScheduled = new JLabel("<HTML><U>Billboards Scheduled</U></HTML>");
        scheduleBillboard.add(billboardsScheduled);
        billboardsScheduled.setBounds((windowX/2)-(105*scale), 20 * scale, 210 * scale, 25 * scale);
        billboardsScheduled.setFont(new Font("Arial", Font.BOLD, 20 * scale));
        billboardsScheduled.setHorizontalAlignment(SwingConstants.CENTER);

        // "Schedule a new billboard" button
        JButton scheduleNewBillboard = new JButton("Schedule a Billboard");
        scheduleBillboard.add(scheduleNewBillboard);
        scheduleNewBillboard.setBounds((windowX/2)-(100*scale), 55 * scale, 200 * scale, 25 * scale);

        // Action listener for scheduleNewBillboard
        scheduleNewBillboard.addActionListener(e -> {
            generateScheduleEditor();
        });

        // Setting up the scroll pane for scheduled billboards
        JScrollPane listScroller = new JScrollPane();
        scheduleBillboard.add(listScroller);
        listScroller.setBounds((windowX/2)-(windowX/3), 90 * scale, ((int) (windowX/1.5)), ((int) (windowY/1.7)));

        // Create a JTable that holds the content of a scheduled billboard
        JTable schedule = new JTable(data, columns);
        schedule.getColumnModel().getColumn(0).setPreferredWidth(110);
        schedule.getColumnModel().getColumn(1).setPreferredWidth(100);
        schedule.getColumnModel().getColumn(2).setPreferredWidth(60);
        schedule.getColumnModel().getColumn(3).setPreferredWidth(60);
        schedule.getColumnModel().getColumn(4).setPreferredWidth(80);
        schedule.getColumnModel().getColumn(5).setPreferredWidth(80);
        scheduleBillboard.add(schedule);
        schedule.setDefaultEditor(Object.class, null);
        schedule.setBounds((windowX/2)-(100*scale), 80 * scale, 200 * scale, (windowY/2) * scale);
        listScroller.setViewportView(schedule);

        return scheduleBillboard;
    }

    /**
     * Generates an editor that is responsible for scheduling a new billboard. In this window the user can select
     * when, the duration displayed for, and how many times they wish to display the billboard.
     */
    private void generateScheduleEditor() {
        // Creates the modal dialog which holds all of the components
        JDialog editWindow = common.setupDialog(((int) (windowX/1.3)), (int) (windowY/1.3), "Schedule Editor");

        // Main panel that all the components will go in
        JPanel scheduleBillboardEditor = new JPanel();
        scheduleBillboardEditor.setLayout(null);
        editWindow.add(scheduleBillboardEditor);

        // Creates the billboard name field and its respective label
        JPanel name = common.setupLabeledField((int) (windowX/2.6)-(100*scale), 15*scale,"Billboard Name:");
        scheduleBillboardEditor.add(name);

        // Creates the day field and its respective label
        JPanel day = common.setupLabeledField((int) (windowX/2.6)-(220*scale), 75*scale, "Day:");
        scheduleBillboardEditor.add(day);

        // Creates the time field and its respective label
        JPanel time = common.setupLabeledField((int) (windowX/2.6)+(20*scale), 75*scale, "Time:");
        scheduleBillboardEditor.add(time);

        // Creates the duration field and its respective label
        JPanel duration = common.setupLabeledField((int) (windowX/2.6)-(220*scale), 135*scale, "Duration:");
        scheduleBillboardEditor.add(duration);

        // Creates the recursion field and its respective label
        JPanel recursion = common.setupLabeledField((int) (windowX/2.6)+(20*scale), 135*scale, "Recursion:");
        scheduleBillboardEditor.add(recursion);

        // Submit button
        JButton submit = new JButton("Submit");
        scheduleBillboardEditor.add(submit);
        submit.setBounds((int) (windowX/2.6)-(100*scale), 205*scale, 200*scale, 25*scale);

        // Submit button action listener
        submit.addActionListener(e -> {
            //Send new schedule information to the server
            window.dispose();
            try {
                generateMainPage(currentUser, 1);
            } catch (IOException ex) {
                ex.printStackTrace();
            }
            editWindow.dispose();
        });

        editWindow.setVisible(true);
    }

    /**
     * This function is responsible for generating the edit users page. On this page the user is presented with a list
     * of all users, alongside a button with the ability to create a new user, or edit an existing user with new
     * permissions.
     * @return A JPanel containing the components used to display the list of users
     * @throws IOException If an input or output exception occurs
     */
    private JPanel generateEditUsers() throws IOException {
        JPanel editUsers = new JPanel();
        editUsers.setLayout(null);

        //Requesting the list of user's from the server
        String[] input = server.getAllUsers(token);

        //Displays the list of users if there is no error
        if (!input[0].equals("null")) {
            //List of users
            String[] users = input[0].split(",");

            //Label for the list of users
            JLabel userLabel = new JLabel("<HTML><U>List of Users</U></HTML>");
            editUsers.add(userLabel);
            userLabel.setBounds((windowX/2)-(100*scale), 20 * scale, 200 * scale, 25 * scale);
            userLabel.setFont(new Font("Arial", Font.BOLD, 20 * scale));
            userLabel.setHorizontalAlignment(SwingConstants.CENTER);

            //"Create User" button
            JButton createUser = new JButton("Create User");
            editUsers.add(createUser);
            createUser.setBounds((windowX/2)-(100*scale), 55 * scale, 200 * scale, 25 * scale);

            // "Logout User" button
            JButton logoutUser = new JButton("Logout");
            editUsers.add(logoutUser);
            logoutUser.setBounds((windowX)-(100*scale), 5 * scale, 80 * scale, 25 * scale);

            //Setting up the scroll pane for userList
            JScrollPane listScroller = new JScrollPane();
            editUsers.add(listScroller);
            listScroller.setBounds((windowX/2)-(windowX/3), 90 * scale, ((int) (windowX/1.5)), ((int) (windowY/1.7)));

            //Displays the list of users
            JList userList = common.list(users, (int) (listScroller.getWidth()/2.1));
            listScroller.setViewportView(userList);

            // Listener for logoutUser
            logoutUser.addActionListener(e -> {
                for (Frame frame : Frame.getFrames()) {
                    frame.dispose();
                }
                generateLoginUI();
            });

            //Action listener for createUser
            createUser.addActionListener(e -> {

                try {
                    //Open up the user editor in new mode
                    generateUserEditor(true, null, userList, listScroller);

                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            });

            //Listener for when a user is doubled clicked
            userList.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    if (e.getClickCount() == 2) {
                        String selectedValue = ((String) userList.getSelectedValue()).trim();

                        try {
                            //Open up the user editor, not in new mode
                            generateUserEditor(false, selectedValue, userList, listScroller);

                        } catch (IOException ex) {
                            ex.printStackTrace();
                        }
                    }
                }
            });
        }

        else {
            //Error message telling the user why they can only change their own password
            //JOptionPane.showMessageDialog(new Frame(), input[1]);

            //Title
            JLabel title = new JLabel("<HTML><U>Change Your Password</U></HTML>");
            editUsers.add(title);
            title.setBounds((windowX/2)-(200*scale), 15*scale, 400*scale, 25*scale);
            title.setFont(new Font("Arial", Font.BOLD, 20*scale));
            title.setHorizontalAlignment(SwingConstants.CENTER);

            //Creating the password field and its respective label
            JLabel passwordLabel = new JLabel("New Password:");
            JPasswordField password = new JPasswordField();
            editUsers.add(passwordLabel);
            editUsers.add(password);
            passwordLabel.setBounds((windowX/2)-(100*scale), 100*scale, 200*scale, 25*scale);
            passwordLabel.setFont(new Font("Arial", Font.BOLD, 15*scale));
            password.setBounds((windowX/2)-(100*scale), 125*scale, 200*scale, 25*scale);

            //Submit button
            JButton submit = new JButton("Submit");
            editUsers.add(submit);
            submit.setBounds((windowX/2)-(100*scale), 160*scale, 200*scale, 25*scale);

            submit.addActionListener(e -> {
                String passwordValue = new String(password.getPassword());

                //Send the server the new user password
                try {
                    String[] input2 = server.setUserPassword(token, passwordValue);

                    //If there was an error display the error message
                    if (input2[0].equals("null")) {
                        JOptionPane.showMessageDialog(new Frame(), input2[1]);

                        //Display the success message
                    } else {
                        JOptionPane.showMessageDialog(new Frame(), input2[0]);
                    }

                    //Set the password field to empty after success or error
                    password.setText("");

                } catch (IOException | NoSuchAlgorithmException ex) {
                    ex.printStackTrace();
                }
            });
        }

        return editUsers;
    }

    /**
     * Creates the dialog window of the user editor, responsible for the creation of a new user, or alteration of
     * an existing user. In this window the user can select which permissions are to be granted to a specified user,
     * and once submitted, will update the information displayed in the edit users page with the appropriate information.
     * @param New The boolean value determining whether the user is being created, or edited
     * @param user The specified user
     * @param userList The list of all users
     * @param listScroller The list scroller
     * @throws IOException If an input or output exception occurs
     */
    private void generateUserEditor(Boolean New, String user, JList userList, JScrollPane listScroller) throws IOException {
        //Creating the modal dialog which holds all of the components
        JDialog editWindow = common.setupDialog((windowX/2), (int) (windowY/1.2), "User Editor");

        //Main panel that all the components will go in
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(null);
        editWindow.add(mainPanel);

        //Creating the username field and it's respective label
        JPanel username = common.setupLabeledField((windowX / 4) - (100 * scale), 10 * scale, "Username");

        //Display username if editing an existing user, otherwise display title
        if (!New) {
            //Title
            JLabel userLabel = new JLabel("<HTML><U>" + user + "</U></HTML>");
            mainPanel.add(userLabel);
            userLabel.setFont(new Font("Arial", Font.BOLD, 20 * scale));
            userLabel.setBounds((windowX / 4) - (100 * scale), 10 * scale, 200 * scale, 25 * scale);
            userLabel.setHorizontalAlignment(SwingConstants.CENTER);
        }

        else {
            mainPanel.add(username);
        }

        //Creating the password field and its respective label
        JLabel passwordLabel = new JLabel("Password:");
        JPasswordField password = new JPasswordField();
        mainPanel.add(passwordLabel);
        mainPanel.add(password);
        passwordLabel.setBounds((windowX/4)-(100*scale), windowY/6, 200*scale, 25*scale);
        passwordLabel.setFont(new Font("Arial", Font.BOLD, 15*scale));
        password.setBounds((windowX/4)-(100*scale), (windowY/6)+(25*scale), 200*scale, 25*scale);

        //"Create Billboard" permission checkbox
        JCheckBox create = new JCheckBox("Create Billboards");
        mainPanel.add(create);
        create.setBounds((windowX/4)-(100*scale), (windowY/3)-(10*scale), 200*scale, 25*scale);

        //"Edit Billboard" permission checkbox
        JCheckBox edit = new JCheckBox("Edit All Billboards");
        mainPanel.add(edit);
        edit.setBounds((windowX/4)-(100*scale), (windowY/3)+(20*scale), 200*scale, 25*scale);

        //"Schedule Billboard" permission checkbox
        JCheckBox schedule = new JCheckBox("Schedule Billboards");
        mainPanel.add(schedule);
        schedule.setBounds((windowX/4)-(100*scale), (windowY/3)+(50*scale), 200*scale, 25*scale);

        //"Edit User" permission checkbox
        JCheckBox editUser = new JCheckBox("Edit Users");
        mainPanel.add(editUser);
        editUser.setBounds((windowX/4)-(100*scale), (windowY/3)+(80*scale), 200*scale, 25*scale);

        if (!New) {
            //Requesting the permissions from the server
            String[] input = server.getPermissions(token, user);

            //If there was an error display it and close the editor
            if (input[0].equals("null")) {
                JOptionPane.showMessageDialog(new Frame(), input[0]);
                editWindow.dispose();

            } else {
                //Auto-check the users current permissions
                if (input[0].contains("createBillboards")) create.setSelected(true);
                if (input[0].contains("editAllBillboards")) edit.setSelected(true);
                if (input[0].contains("scheduleBillboards")) schedule.setSelected(true);
                if (input[0].contains("editUsers")) editUser.setSelected(true);
            }
        }

        //Submit button
        JButton submit = new JButton("Submit");
        mainPanel.add(submit);
        if (!New) submit.setBounds((windowX/4)-(150*scale), (windowY/2)+(50*scale), 150*scale, 25*scale);
        else submit.setBounds((windowX/4)-(75*scale), (windowY/2)+(50*scale), 150*scale, 25*scale);

        //Delete account button
        if (!New) {
            JButton deleteUser = new JButton("Delete User");
            mainPanel.add(deleteUser);
            deleteUser.setBounds((windowX/4), (windowY/2)+(50*scale), 150*scale, 25*scale);

            //Delete Account button action listener
            deleteUser.addActionListener(e -> {
                //Tell the server to delete the user
                try {
                    String[] input = server.deleteUser(token, user);

                    //If there was an error display it and close the user editor
                    if (input[0].equals("null")) {
                        JOptionPane.showMessageDialog(new Frame(), input[1]);

                        //Display the success message and close the editor
                    } else {
                        JOptionPane.showMessageDialog(new Frame(), input[0]);
                        window.dispose();
                        generateMainPage(currentUser, 2);
                        editWindow.dispose();
                    }

                } catch (IOException ex) {
                    ex.printStackTrace();
                }
            });
        }

        //Submit button action listener
        submit.addActionListener(e -> {
            //Getting the permissions from each checkbox
            String permissions = (create.isSelected() ? "1" : "0") + "," + (edit.isSelected() ? "1" : "0") + "," +
                    (schedule.isSelected() ? "1" : "0") + "," + (editUser.isSelected() ? "1" : "0");

            //Getting the username and password
            String usernameValue = common.getTextField(username).getText();
            String passwordValue = new String(password.getPassword());
            if (passwordValue.equals("")) passwordValue = "null";

            try {
                String[] input;

                //Send new user information to the server
                if (New) {
                    input = server.createUser(token, usernameValue, passwordValue, permissions);

                    //Send edited user information to the server
                } else {
                    input = server.setUser(token, user, passwordValue, permissions);
                }

                //Displaying the error message
                if (input[0].equals("null")) {
                    JOptionPane.showMessageDialog(new Frame(), input[1]);

                    //Displaying the success message and closing the user editor
                } else {
                    JOptionPane.showMessageDialog(new Frame(), input[0]);
                    window.dispose();
                    generateMainPage(currentUser, 2);
                    editWindow.dispose();
                }

            } catch (IOException | NoSuchAlgorithmException ex) {
                ex.printStackTrace();
            }
        });

        editWindow.setVisible(true);
    }
}