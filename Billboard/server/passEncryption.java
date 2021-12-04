package Billboard.server;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Random;

public class passEncryption {
    public static byte[] toBytes(String pass) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        return md.digest(pass.getBytes());
    }

    public static String bytesToString(byte[] hashedPass) {
       StringBuffer sb = new StringBuffer();
       for (byte b : hashedPass) {
           sb.append(String.format("%02x", b & 0xFF));
       }
       return sb.toString(); // Hashed pass
    }

    public static String saltShaker() {
        Random rng = new Random();
        byte[] saltBytes = new byte[32];
        rng.nextBytes(saltBytes);
        return bytesToString(saltBytes);
    }

    public static String hashToSalt(String hashedPass, String saltString) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        return bytesToString(md.digest((hashedPass + saltString).getBytes()));
    }
}
