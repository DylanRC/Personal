package Billboard.viewer;

import java.awt.*;
import javax.imageio.ImageIO;
import java.net.URL;
import java.util.Base64;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.StringReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.w3c.dom.Document;
import org.xml.sax.InputSource;


/**
 * Implements methods that perform specific IO operations used by a billboard.
 */
public class BillboardIO {
    /**
     * Displays the image found at the specified URL.
     * @param url The specified URL to retrieve an image from.
     * @return If the image was successfully retrieved at the specified URL, the image is returned.
     *         If the URL is not valid, null is returned.
     */
    public static Image URL_Image(URL url) {
        try {
            return ImageIO.read(url);
        }
        // If the URL provided does not link to an image, return an error message
        catch (IOException e) {
            System.err.println("Invalid URL");
        }
        return null;
    }

    /**
     * Displays the image found at the specified Data.
     * @param imageData The specified Data to retrieve an image from.
     * @return If the image was successfully retrieved at the specified Data, the image is returned.
     *         If the Data is not valid, null is returned.
     */
    public static Image dataImage(String imageData) {
        byte[] byteImage = Base64.getDecoder().decode(imageData);
        ByteArrayInputStream inputStream = new ByteArrayInputStream(byteImage);
        try {
            return ImageIO.read(inputStream);
        }
        // If the Data provided does not link to an image, return an error message
        catch (IOException e) {
            System.err.println("Invalid Data");
        }
        return null;
    }

    /**
     * Displays the contents of a specified file in string format.
     * @param xmlFile The specified XML file wanted in string format.
     * @return If the file is successfully converted into string format, the string contents of the file is returned.
     *         If the file is not valid, null is returned.
     */
    public static String stringFile(String xmlFile) {
        try {
            return new String(Files.readAllBytes(Paths.get(xmlFile)));
        }
        // If the specified file cannot be converted into a string, return an error message
        catch(Exception e) {
            System.err.println("Invalid File");
        }
        return null;
    }

    /**
     * Parses an input string (XML file in string format) and converts it into a DOM.
     * @param xmlStringFile The specified xml file in string format wanted to be parsed.
     * @return If the file is successfully converted into a DOM representation, the DOM is returned.
     *         If the file is not valid, null is returned.
     */
    public static Document DOM_File(String xmlStringFile) {
        try {
            DocumentBuilder builder = DocumentBuilderFactory.newInstance().newDocumentBuilder();
            return builder.parse(new InputSource(new StringReader(xmlStringFile)));
        }
        // If the input string provided is invalid, return an error message
        catch (Exception e) {
            System.err.println("Invalid File");
        }
        return null;
    }
}
