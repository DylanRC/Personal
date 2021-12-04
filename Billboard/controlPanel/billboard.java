package Billboard.controlPanel;

import java.io.Serializable;

/**
 * This is a billboard object used to store retrieved information about a billboard. It implements 'Serializable'
 * so that it can be sent as an object to and from the server.
 */
public class billboard implements Serializable {
    private String name;
    private String backgroundColour;
    private String messageColour;
    private String messageText;
    private String infoColour;
    private String infoText;
    private String picture;

    //Get and Set methods for each of the class variables;
    public void setName(String name) { this.name = name;}
    public String getName() { return name;}

    public void setBackgroundColour(String backgroundColour) { this.backgroundColour = backgroundColour;}
    public String getBackgroundColour() { return backgroundColour;}

    public void setMessageColour(String messageColour) { this.messageColour = messageColour; }
    public String getMessageColour() { return messageColour; }

    public void setMessageText(String messageText) { this.messageText = messageText; }
    public String getMessageText () { return messageText; }

    public void setInfoColour(String infoColour) { this.infoColour = infoColour; }
    public String getInfoColour() { return infoColour; }

    public void setInfoText(String infoText) { this.infoText = infoText; }
    public String getInfoText() { return infoText; }

    public void setPicture(String picture) { this.picture = picture; }
    public String getPicture() { return picture; }

    //Setting the values using the XML format
    public void billboardFromXML() {

    }
}