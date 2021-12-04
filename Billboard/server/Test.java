package Billboard.server;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

public class Test {

    public static void main (String[] args) throws SQLException {
        databaseRetrieval.checkBillboardExists("iPhone");
    }
}
