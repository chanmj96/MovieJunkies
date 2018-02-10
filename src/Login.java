
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.http.Cookie;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.JsonObject;

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private Connection dbcon;
	private Statement stmt;
	private ResultSet rs;   
	
    /**
     * @see HttpServlet#HttpServlet()
     */
    public Login() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String email = request.getParameter("email");
		String password = request.getParameter("password");
		
		String loginUser = "testuser"; 
		String loginPasswd = "password";
		String loginUrl = "jdbc:mysql://localhost:3306/moviedb?autoReconnect=true&useSSL=false";
		
		// this example only allows username/password to be test/test
		// in the real project, you should talk to the database to verify username/password
		
		JsonObject responseJsonObject = new JsonObject();
		
		PrintWriter out = response.getWriter();
		try {
			Class.forName("com.mysql.cj.jdbc.Driver").getConstructor().newInstance();
			dbcon = DriverManager.getConnection(loginUrl, loginUser, loginPasswd);
			stmt = dbcon.createStatement();
			
			request.getSession(true);
			request.getSession().setAttribute("user", new User(email));
			
			 // Emails should be unique to users as a login requirement.
			 // test with (cc@msn.com, 1111)
			 String query = "SELECT * from customers c WHERE c.email=\"" + email + "\"";
			 rs = stmt.executeQuery(query);
			 
			 if(!rs.next())
			 {
				 responseJsonObject.addProperty("status", "fail");
				 responseJsonObject.addProperty("message", "Email is not recognized!");
				 out.write(responseJsonObject.toString());
			 }
			 else
			 {
				 String db_password = rs.getString("password");
				 if(db_password.equals(password))
				 {
					 responseJsonObject.addProperty("status", "success");
					 responseJsonObject.addProperty("email", email);
					 responseJsonObject.addProperty("message", "success");
					 out.write(responseJsonObject.toString());
					 ((User)request.getSession().getAttribute("user")).setAccess(true);
					 //Cookie loginCookie = new Cookie("user",email);
					 //loginCookie.setMaxAge(30*60);
					 //response.addCookie(loginCookie);
				 }
				 else
				 { 
					 responseJsonObject.addProperty("status", "fail");
					 responseJsonObject.addProperty("message", "incorrect password");
					 out.write(responseJsonObject.toString());
				 }
			 }
		}
		catch(java.lang.Exception ex)
		{
			ex.printStackTrace();
			responseJsonObject.addProperty("status", "fail");
			responseJsonObject.addProperty("message", "an error occurred");
			out.write(responseJsonObject.toString());
		}
		finally {
			try {rs.close();} catch (Exception e) {}
			try {stmt.close();} catch (Exception e) {}
			try {dbcon.close();} catch (Exception e) {}
			out.close();
		}
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
