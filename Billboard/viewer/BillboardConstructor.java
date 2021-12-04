package Billboard.viewer;

import java.awt.*;
import javax.swing.*;
import java.net.URL;
import javax.swing.text.SimpleAttributeSet;
import javax.swing.text.StyleConstants;
import javax.swing.text.StyledDocument;
import java.util.ArrayList;
import org.w3c.dom.Document;
import org.w3c.dom.Element;


/**
 * Constructs a billboard showing all of the graphical components specified for in a given XML file.
 */
public class BillboardConstructor extends JPanel {
    // Constants used throughout class
    static private final String BACKGROUND_COLOUR = "#FFFFFF";
    static final int MESSAGE = 1;
    static final int INFORMATION = 2;
    static private final String TEXT_COLOUR = "#000000";
    static final int PICTURE = 3;

    private Dimension billboardSize;
    private Document DOM_document;
    private ArrayList<Element> billboardElements;

    /**
     * Creates a billboard of appropriate specification.
     * Employed in the BillboardGUI class to create an instance of a constructed billboard.
     * @param xmlFile The specified XML file used to display the content seen in the billboard.
     * @param billboardDisplaySize Size of billboard, according to the size of the users screen.
     */
    public BillboardConstructor(String xmlFile, Dimension billboardDisplaySize) {
        // Displays a billboard to a specified size
        billboardSize = billboardDisplaySize;
        // Creates a static display size
        setPreferredSize(billboardDisplaySize);

        // Sets up the layout of a billboard
        setLayout(new GridBagLayout());

        // Converts the content in an xml file into a string
        String xmlString = BillboardIO.stringFile(xmlFile);

        // Converts the content in a string of xml into a DOM
        DOM_document = BillboardIO.DOM_File(xmlString);

        // Retrieves the billboard elements
        billboardElements = getBillboardElements();

        // Constructs the billboard using the elements supplied
        setBackgroundColour();
        int fontSize = addMessageComponent();
        addPictureComponent();
        addInformationComponent(fontSize);
    }

    /**
     * Retrieves the element with a particular elementName from the DOM.
     * @param DOM_File Dom file to retrieve the element from.
     * @param elementName The specified name of the element to search for.
     * @return If the element requested for is found, the element is returned.
     *         If no element is found, null is returned.
     */
    private Element retrieveDOM_Element(Document DOM_File, String elementName) {
        try {
            return (Element) DOM_File.getElementsByTagName(elementName).item(0);
        }
        catch (Exception ignored) {}
        return null;
    }

    /**
     * Creates a list of all four billboard elements, 'billboard', 'message', 'information' and 'picture' from the DOM.
     * @return A list of the billboard elements.
     */
    private ArrayList<Element> getBillboardElements() {
        ArrayList<Element> billboardElements = new ArrayList<>();

        billboardElements.add(DOM_document.getDocumentElement());
        billboardElements.add(retrieveDOM_Element(DOM_document, "message"));
        billboardElements.add(retrieveDOM_Element(DOM_document, "information"));
        billboardElements.add(retrieveDOM_Element(DOM_document, "picture"));

        return billboardElements;
    }

    /**
     * Retrieves the background colour of a specified element.
     * @param element The particular element to retrieve the background colour from.
     * @return The background colour of the element.
     */
    private Color retrieveBackgroundColour(Element element) {
        String billboardBackgroundColour = element.getAttribute("background");
        if (billboardBackgroundColour.equals("")) {
            billboardBackgroundColour = BACKGROUND_COLOUR;
        }
        return Color.decode(billboardBackgroundColour);
    }

    /**
     * Sets the background colour of a billboard.
     */
    private void setBackgroundColour() {
        Color backgroundColour = retrieveBackgroundColour(billboardElements.get(0));
        setBackground(backgroundColour);
    }

    /**
     * Retrieves the dimensions of a message component, in regards to other billboard components present.
     * @return If only the message component is present, the size of the message is returned.
     *         If the message and information component is present, an appropriate size of the message is returned.
     *         If every component is present, an appropriate size of the message is returned.
     */
    private Dimension retrieveMessageSize() {
        // If there is no content present in the information and picture component, return the size of the message
        if ((billboardElements.get(INFORMATION) == null) && (billboardElements.get(PICTURE) == null)) {
            return new Dimension(billboardSize.width, billboardSize.height);
        }
        // If there is no content present in the picture component, return an appropriate size of the message
        if (billboardElements.get(PICTURE) == null) {
            return new Dimension(billboardSize.width, billboardSize.height/2);
        }
        return new Dimension(billboardSize.width, billboardSize.height/3);
    }

    /**
     * Retrieves the text of a specified DOM element.
     * @param textElement The particular element to retrieve the text from.
     * @return The text content of the element.
     */
    private String retrieveTextElement(Element textElement) {
        return textElement.getTextContent();
    }

    /**
     * Retrieves the text colour of a specified element.
     * @param element The particular element to retrieve the text colour from.
     * @return The text colour of the element.
     */
    private Color retrieveTextColour(Element element) {
        String textColour = element.getAttribute("colour");
        if (textColour.equals("")) {
            textColour = TEXT_COLOUR;
        }
        return Color.decode(textColour);
    }

    /**
     * Rescales the size of a font to allow the dimensions of that font to fit on one line.
     * @param text The string of text to fit on one line.
     * @param textSize Size of the text.
     * @return The appropriate font size.
     */
    private Font scaleMessageFontSize(String text, Dimension textSize) {    //TODO: Change (Copied from internet)
        double fontSize = 500;
        Font tempFont = new Font(Font.SANS_SERIF, Font.PLAIN, (int) Math.floor(fontSize));
        double safetyFactor = textSize.width * 0.1;
        double width = getFontMetrics(tempFont).stringWidth(text) + safetyFactor;
        fontSize = (textSize.width / width) * fontSize;
        Font newFont = new Font(Font.SANS_SERIF, Font.PLAIN, (int) Math.floor(fontSize));

        double newHeight = getFontMetrics(newFont).getHeight();
        if (newHeight > textSize.height) {
            fontSize = (textSize.height * fontSize) / newHeight;
            newFont = new Font(Font.SANS_SERIF, Font.PLAIN, (int) Math.floor(fontSize));
        }

        return newFont;
    }

    /**
     * Adds all instances of message components to a billboard.
     * @return The appropriate message size.
     */
    private int addMessageComponent() {
        Element messageElement = billboardElements.get(1);
        // If the message element contains content, retrieve the message and format it appropriately
        if (messageElement != null) {
            String message = retrieveTextElement(messageElement);
            // Instantiates a new message and displays the content in the center
            JLabel messageComponent = new JLabel(message, SwingConstants.CENTER);
            messageComponent.setForeground(retrieveTextColour(messageElement));

            Dimension messageSize = retrieveMessageSize();
            messageComponent.setPreferredSize(messageSize);

            Font messageFont = scaleMessageFontSize(message, messageSize);
            messageComponent.setFont(messageFont);

            GridBagConstraints center = centerComponentAtLocation(0, 0);
            add(messageComponent, center);

            return messageFont.getSize();
        }
        return 0;
    }

    /**
     * Uses a GridBagConstraints object to center a particular component at a desired location.
     * @param x Position of x in grid.
     * @param y Position of y in grid.
     * @return The object of GridBagConstraints.
     */
    private GridBagConstraints centerComponentAtLocation(int x, int y) {
        GridBagConstraints center = new GridBagConstraints();
        center.gridx = x;
        center.gridy = y;
        center.anchor = GridBagConstraints.CENTER;
        return center;
    }

    /**
     * Retrieves the dimensions of an information component, in regards to other billboard components present.
     * @return If only the information component is present, an appropriate size of the information is returned.
     *         If the information and message component is present, an appropriate size of the information is returned.
     *         If every component is present, an appropriate size of the information is returned.
     */
    private Dimension retrieveInformationSize() {
        // If there is no content present in the message and picture component, return an appropriate size of the information
        if ((billboardElements.get(MESSAGE) == null) && (billboardElements.get(PICTURE) == null)) {
            return new Dimension((int) (billboardSize.width*0.75), billboardSize.height/2);
        }
        // If there is no content present in the picture component, return an appropriate size of the information
        if (billboardElements.get(PICTURE) == null) {
            return new Dimension((int) (billboardSize.width*0.75), billboardSize.height/2);
        }
        return new Dimension((int) (billboardSize.width*0.75), billboardSize.height/3);
    }

    /**
     * Rescales the size of a font to allow the font to fit within the dimension size (this can traverse multiple lines).
     * @param text The string of text to fit across multiple lines.
     * @param textSize Size of the text.
     * @param maxFontSize The maximum font size permitted.
     * @return The appropriate font size.
     */
    private Font scaleInformationFontSize(String text, Dimension textSize, int maxFontSize) {   //TODO: Change (Copied from internet)
        double safetyMultiplier = 2.0;
        int maxInfoFont = 200;
        double fontSize = maxFontSize <= 0 ? maxInfoFont : maxFontSize;
        Font tempFont = new Font(Font.SANS_SERIF, Font.PLAIN, (int) Math.floor(fontSize));
        double width = getFontMetrics(tempFont).stringWidth(text) * safetyMultiplier;
        double height = getFontMetrics(tempFont).getHeight();

        while(width * height > textSize.width * textSize.height) {
            fontSize--;
            tempFont = new Font(Font.SANS_SERIF, Font.PLAIN, (int) Math.floor(fontSize));
            width = getFontMetrics(tempFont).stringWidth(text) * safetyMultiplier;
            height = getFontMetrics(tempFont).getHeight();
        }

        return new Font(Font.SANS_SERIF, Font.PLAIN, (int) Math.floor(fontSize));
    }

    /**
     * Adds all instances of information components to a billboard.
     * @param maxFontSize The maximum font size permitted.
     */
    private void addInformationComponent(int maxFontSize) {
        Element informationElement = billboardElements.get(2);
        // If the information element contains content, retrieve the information and format it appropriately
        if (informationElement != null) {
            JPanel informationComponent = new JPanel(new GridBagLayout());
            Dimension informationSize = retrieveInformationSize();
            informationComponent.setPreferredSize(informationSize);

            // Displays the text within the information component in the center
            String text = retrieveTextElement(informationElement);
            JTextPane information = new JTextPane();
            information.setText(text);
            StyledDocument informationText = information.getStyledDocument();
            // Instantiates a new attribute set to center the text
            SimpleAttributeSet centeredText = new SimpleAttributeSet();
            StyleConstants.setAlignment(centeredText, StyleConstants.ALIGN_CENTER);
            informationText.setParagraphAttributes(0, informationText.getLength(), centeredText, false);
            // Makes the information component non interactive
            information.setEditable(false);
            information.setFocusable(false);

            Font font = scaleInformationFontSize(text, informationSize, maxFontSize - 1);
            information.setFont(font);

            // Applies the appropriate colours to the information component
            Color foregroundColour = retrieveTextColour(informationElement);
            information.setForeground(foregroundColour);
            Color backgroundColour = retrieveBackgroundColour(billboardElements.get(0));
            information.setBackground(backgroundColour);
            informationComponent.setBackground(backgroundColour);

            // Aligns the text with the information component
            GridBagConstraints align = centerComponentAtLocation(0,0);
            align.weighty = 1;
            align.weightx = 1;
            align.fill = GridBagConstraints.HORIZONTAL;
            informationComponent.add(information, align);

            GridBagConstraints center = centerComponentAtLocation(0, 2);
            add(informationComponent, center);
        }
    }

    /**
     * Retrieves the picture of a specified DOM element.
     * @param pictureElement The particular element to retrieve the picture from.
     * @return If the URL or Data is valid, the picture is returned.
     *         If the URL or Data is not valid, null is returned.
     */
    private Image retrievePictureElement(Element pictureElement) {
        String pictureURL = pictureElement.getAttribute("url");
        // If the picture was supplied in URL format and is valid, return picture
        if (!pictureURL.equals("")) {
            try {
                URL url = new URL(pictureURL);
                return BillboardIO.URL_Image(url);
            }
            catch (Exception e) {
                System.err.println("Invalid URL");
                return null;
            }
        }
        else {
            String pictureData = pictureElement.getAttribute("data");
            // If the picture was supplied in Data format and is valid, return picture
            if (!pictureData.equals("")) {
                try {
                    return BillboardIO.dataImage(pictureData);
                }
                catch (Exception e) {
                    System.err.println("Invalid Data of image");
                    return null;
                }
            }
            return null;
        }
    }

    /**
     * Retrieves the dimensions of a picture component, in regards to other billboard components present.
     * @return If only the picture component is present, the size of the picture is returned.
     *         If the message or information component is not present, an appropriate size of the picture is returned.
     *         If every component is present, an appropriate size of the picture is returned.
     */
    private Dimension retrievePictureSize() {
        // If there is no content present in the message and information component, return the size of the picture
        if ((billboardElements.get(MESSAGE) == null) && (billboardElements.get(INFORMATION) == null)) {
            return new Dimension(billboardSize.width, billboardSize.height);
        }
        // If there is no content present in the message or information component, return an appropriate size of the picture
        if ((billboardElements.get(MESSAGE) == null) || (billboardElements.get(INFORMATION) == null)) {
            return new Dimension(billboardSize.width, 2*billboardSize.height/3);
        }
        return new Dimension(billboardSize.width, billboardSize.height/3);
    }

    /**
     * Retrieves the boundary dimensions of an image within a picture component.
     * @return If only the image boundary component is present, not including the picture component, the size of the image boundary is returned.
     *         If every component is present, an appropriate size of the image boundary is returned.
     */
    private Dimension retrieveImageBoundarySize() {
        // If there is no content present in the message and information component, return an appropriate size of the image boundary
        if ((billboardElements.get(MESSAGE) != null) && (billboardElements.get(INFORMATION) != null)) {
            return new Dimension(billboardSize.width/3, billboardSize.height/3);
        }
        return new Dimension(billboardSize.width/2, billboardSize.height/2);
    }

    /**
     * Retrieves the dimensions of an image after it has undergone rescaling (maintaining ratio aspect) to fit a specified picture size.
     * @param imageBoundarySize The size of the boundary in which the image needs to fit.
     * @param pictureSize The size of the picture.
     * @return The rescaled image size.
     */
    private Dimension retrieveRescaledImageSize(Dimension imageBoundarySize, Dimension pictureSize) {
        int width = pictureSize.width;
        int height = pictureSize.height;
        int boundaryWidth = imageBoundarySize.width;
        int boundaryHeight = imageBoundarySize.height;

        int newWidth = boundaryWidth;
        int newHeight = (newWidth * height) / width;

        if (newHeight > boundaryHeight) {
            newHeight = boundaryHeight;
            newWidth = (newHeight * width) / height;
        }

        return new Dimension(newWidth, newHeight);
    }

    /**
     * Adds all instances of picture components to a billboard.
     */
    private void addPictureComponent() {
        Element pictureElement = billboardElements.get(3);
        // If the picture element contains content, retrieve the picture and format it appropriately
        if (pictureElement != null) {
            Image picture = retrievePictureElement(pictureElement);

            assert picture != null;
            // Scales the size of the picture appropriately
            Dimension pictureSize = new Dimension(picture.getWidth(null), picture.getHeight(null));
            Dimension imageBoundarySize = retrieveImageBoundarySize();
            Dimension newPictureSize = retrieveRescaledImageSize(imageBoundarySize, pictureSize);
            Image scaledImage = picture.getScaledInstance(newPictureSize.width, newPictureSize.height, Image.SCALE_SMOOTH);

            // Instantiates a new picture and displays the content in the center
            JLabel pictureComponent = new JLabel(new ImageIcon(scaledImage), SwingConstants.CENTER);
            pictureComponent.setPreferredSize(retrievePictureSize());

            GridBagConstraints center = centerComponentAtLocation(0, 1);
            add(pictureComponent, center);
        }
    }
}
