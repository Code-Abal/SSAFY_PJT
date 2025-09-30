package com.ssafy.util;

import java.io.InputStream;
import java.net.Socket;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DbUtil {

	private final static String DRIVER = "com.mysql.cj.jdbc.Driver";
	private final static String URL = "jdbc:mysql://ssafy-pjt.clqo0uu22lcj.ap-northeast-2.rds.amazonaws.com/ssafyhome";
	private final static String USER = "admin";
	private final static String PASSWORD = "rootroot";
	
	static {
		try {
			Class.forName(DRIVER);
		} catch (ClassNotFoundException e) {
			e.printStackTrace();
		}
	}
	
	private DbUtil() {}
	
	public static Connection getConnection() throws SQLException {
		return DriverManager.getConnection(URL, USER, PASSWORD);
	}
	
	
	public static void close(AutoCloseable...closables) {
		for(AutoCloseable closable : closables) {
				try {
					if (closable != null)
						closable.close();
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
		}
	}
	
}
