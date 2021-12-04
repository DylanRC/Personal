package Billboard.server;

import java.security.SecureRandom;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Random;

public class sessionToken {
    public static String newToken() {
        SecureRandom rng = new SecureRandom();
        byte[] randBytes = new byte[32];
        rng.nextBytes(randBytes);
        return passEncryption.bytesToString(randBytes);
    }

    public static boolean checkToken(String storedToken, String receivedToken) {
        if (storedToken.equals(receivedToken)) return true;
        else return false;
    }

    public static String tokenExpiry() {
        Calendar expiry = Calendar.getInstance();
        Date date = new Date();
        expiry.setTime(date);
        expiry.add(Calendar.HOUR, 24);
        return expiry.toString();
    }

    public static HashMap<String, String> establishToken(String tokenStr, String expiry) {
        HashMap<String, String> userToken = new HashMap<String, String>();
        userToken.put("tokenStr", tokenStr);
        userToken.put("expiry", expiry);
        return userToken;
    }

    public static boolean verifyExpiry(HashMap<String, String> userToken) throws ParseException {
        Date date = new Date();
        Date expiry = new SimpleDateFormat("yyyy-MM-dd").parse(userToken.get("expiry"));
        if(date.before(expiry)) {
            return true;
        }
        else {
            return false;
        }
    }
}
