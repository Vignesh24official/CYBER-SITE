# MCA – II Year: Advanced Programming in Java Group Assignment Report

## Title Page
* **Course & Year**: Master of Computer Applications (MCA) – II Year
* **Subject**: Advanced Programming in Java
* **Project Title**: **CyberShield: Online Incident and Complaint Management System**
* **Application Category**: Suggested Topic #5 – Online Complaint Management System
* **Architecture**: 3-Tier Enterprise Web Application (HTML5, CSS3, Java Servlet, JSP, JDBC, MySQL)

---

## 1. Introduction
With the exponential rise in digital financial transactions and online communications, cyber-enabled crimes such as phishing, unauthorized UPI transfers, identity theft, and malware extortion pose critical security challenges. 

**CyberShield** is an end-to-end, dynamic web application engineered using **Java Servlet, JavaServer Pages (JSP), Java Database Connectivity (JDBC), and MySQL**. It provides a real-world cybersecurity incident management platform that connects victims (citizens), security triage coordinators (SOC administrators), and digital forensic investigators into a single synchronized workflow.

---

## 2. Problem Statement
Traditional cyber complaint mechanisms often suffer from:
1. Fragmented communication between citizens and investigators.
2. Lack of live progress tracking and transparent resolution reporting.
3. Inability for investigators to correlate threat observables (suspicious URLs, IP hosts, phone numbers, UPI VPAs, and file checksums) within a single investigation workspace.
4. Absence of an encrypted, real-time bidirectional case chat channel for continuous victim-officer collaboration.

---

## 3. Objectives
The primary objectives of the application are:
1. To implement an **Online Complaint Management System** adhering strictly to MCA Advanced Java standards.
2. To demonstrate dynamic UI rendering using **HTML5, CSS3, and JSP**.
3. To process HTTP client requests (**GET and POST**) via **Java Servlets (`HttpServlet`)**.
4. To establish database persistence and query execution via **JDBC (`PreparedStatement`, `DriverManager`, `ResultSet`)**.
5. To execute complete **CRUD operations** (Create, Read, Update, Delete) on incident complaints, notes, and messages.
6. To implement an **Investigator Workspace** featuring an interactive Linux command forensic console, hacking tools hub, and resolution report generator.
7. To provide an encrypted bidirectional **Case Chat Room** for citizen-investigator communication.

---

## 4. Software and Hardware Requirements

### Software Requirements
* **Operating System**: Windows 10/11, Linux (Ubuntu/Kali), or macOS
* **Java Development Kit**: JDK 21+ / JDK 17
* **Web & Servlet Container**: Apache Tomcat 10.x / Embedded Tomcat (Jakarta EE 6+)
* **Database Management System**: MySQL 8.x / MariaDB (Driver: `com.mysql.cj.jdbc.Driver`)
* **Libraries / Technologies**: Jakarta Servlet API, Jakarta JSP & JSTL, JDBC API, HTML5, CSS3, JavaScript

### Hardware Requirements
* **Processor**: Dual-Core 2.0 GHz or higher (Intel Core i3/i5/i7 or AMD Ryzen)
* **RAM**: 4 GB minimum (8 GB recommended)
* **Storage**: 500 MB free hard disk space for application binaries and database logs

---

## 5. System Architecture

The application adopts a standard **MVC (Model-View-Controller) 3-Tier Architecture**:

```
+---------------------------------------------------------------------------------+
|                               PRESENTATION TIER                                 |
|   HTML5 + CSS3 + JSP (JavaServer Pages)                                         |
|   - index.jsp                - login.jsp                - register.jsp          |
|   - fileComplaint.jsp        - myComplaints.jsp         - complaintDetail.jsp   |
|   - adminDashboard.jsp       - investigatorWorkspace.jsp - caseChat.jsp         |
+---------------------------------------------------------------------------------+
                                       |
                       HTTP GET / POST | Request & Response
                                       v
+---------------------------------------------------------------------------------+
|                                BUSINESS CONTROLLER TIER                         |
|   Java Servlets (jakarta.servlet.http.HttpServlet)                              |
|   - LoginServlet             - RegisterServlet          - LogoutServlet         |
|   - ComplaintServlet         - AdminComplaintServlet    - DeleteComplaintServlet|
|   - InvestigatorWorkspaceServlet - ResolveComplaintServlet - CaseChatServlet     |
+---------------------------------------------------------------------------------+
                                       |
                     DAO Layer Calls   | JavaBeans (ComplaintBean, UserBean, etc.)
                                       v
+---------------------------------------------------------------------------------+
|                                DATA ACCESS TIER (JDBC)                          |
|   Pure JDBC API (java.sql.*)                                                    |
|   - DBConnection.java (DriverManager, Connection management)                    |
|   - UserDAO.java             - ComplaintDAO.java                                |
|   - InvestigationDAO.java    - ChatDAO.java                                     |
+---------------------------------------------------------------------------------+
                                       |
                     SQL Queries       | ResultSets
                                       v
+---------------------------------------------------------------------------------+
|                                  DATABASE TIER                                  |
|   MySQL Relational Database Server (`cybershield_db`)                           |
|   - users, roles, complaints, complaint_assignments, investigation_notes,       |
|     case_messages, threat_categories, threat_types                              |
+---------------------------------------------------------------------------------+
```

---

## 6. Flow Diagram

```
[ Citizen ]                         [ Admin ]                       [ Investigator ]
     |                                  |                                  |
     |--- 1. File Complaint (POST) ---->|                                  |
     |    (Status: SUBMITTED)           |                                  |
     |                                  |--- 2. Triage & Assign Case ----->|
     |                                  |    (Status: ASSIGNED)            |
     |                                                                     |
     |                                      3. Access Workspace <----------|
     |                                      - Run Linux Commands           |
     |                                        (nmap, whois, curl, etc.)    |
     |                                      - Assess Hacking Tools Hub     |
     |                                      - Log Findings via JDBC        |
     |                                                                     |
     |                                      4. Conclude & Resolve -------->|
     |                                         (Status: RESOLVED)          |
     |                                                                     |
     |<-- 5. View Resolution Dossier <-------------------------------------|
     |       & Print Certificate                                           |
     |                                                                     |
     |<========== 6. Bidirectional Case Chat Room Communication ==========>|
```

---

## 7. Module Description

### Module 1: Authentication & Clearance Module
* **Servlets**: `LoginServlet.java`, `RegisterServlet.java`, `LogoutServlet.java`
* **JSP Pages**: `login.jsp`, `register.jsp`
* **Functionality**:
  * Authenticates users against MySQL using `PreparedStatement`.
  * Enforces role-based cryptographic clearance challenges:
    * **Admin**: Secret Clearance Code `MAIN`
    * **Investigator**: Secret Clearance Code `SUB`
    * **Citizen**: Standard User access
  * Initializes secure HTTP Session (`HttpSession`).

### Module 2: Citizen Incident Reporting Module (CREATE Operation)
* **Servlet**: `ComplaintServlet.java` (`doPost`)
* **JSP Page**: `fileComplaint.jsp`
* **Functionality**: Captures incident title, category, threat vector, financial loss, suspicious URL, attacker details, and description. Inserts record into MySQL via JDBC and generates a sequential tracking number (`CS-2026-XXXXXX`).

### Module 3: Incident Tracking & Resolution Viewer Module (READ Operation)
* **Servlet**: `ComplaintServlet.java` (`doGet`)
* **JSP Pages**: `myComplaints.jsp`, `complaintDetail.jsp`
* **Functionality**: Fetches complaints filed by the citizen. When status is `RESOLVED`, displays the **Official Cyber Investigation Resolution Report** with verdict, root cause analysis, cyber cell actions, and a printable incident clearance certificate.

### Module 4: Administrative SOC Triage & Assignment Module (UPDATE & DELETE Operations)
* **Servlet**: `AdminComplaintServlet.java`, `DeleteComplaintServlet.java`
* **JSP Page**: `adminDashboard.jsp`
* **Functionality**: Displays all complaints registered in the system. Admin assigns active cases to available investigators (UPDATE). Also allows administrative record deletion (DELETE).

### Module 5: Investigator Workbench & Forensic Suite Module
* **Servlet**: `InvestigatorWorkspaceServlet.java`, `ResolveComplaintServlet.java`
* **JSP Page**: `investigatorWorkspace.jsp`
* **Functionality**:
  * **Interactive Kali Linux Terminal Emulator**: Simulates realistic cyber commands (`nmap`, `whois`, `curl -I`, `sha256sum`, `tcpdump`, `dig`, `forensics --scan`).
  * **Hacking & Forensic Software Hub**: Evaluates port vulnerability, domain age, phishing risk index, evidence malware signatures, and money mule networks.
  * **Resolution Report Dispatcher**: Submits conclusive determination, executive summary, enforcement actions, and citizen safety guidance.

### Module 6: Secure Case Chat Room Module
* **Servlet**: `CaseChatServlet.java`
* **JSP Page**: `caseChat.jsp`
* **Functionality**: Enables bidirectional communication between citizen and investigator. Features role tagging, quick response pills, timestamping, and artifact snippet attachments.

---

## 8. Database Design

### Database Name: `cybershield_db`

#### Table 1: `roles`
| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Role ID |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | ROLE_USER, ROLE_INVESTIGATOR, ROLE_ADMIN |

#### Table 2: `users`
| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | User ID |
| `public_id` | VARCHAR(50) | NOT NULL, UNIQUE | Public UUID |
| `full_name` | VARCHAR(100) | NOT NULL | User's full name |
| `email` | VARCHAR(150) | NOT NULL, UNIQUE | Login email |
| `phone` | VARCHAR(20) | NULL | Contact phone number |
| `password_hash` | VARCHAR(255) | NOT NULL | Stored password hash |
| `role_id` | BIGINT | FOREIGN KEY (`roles.id`) | Assigned role |
| `account_status`| VARCHAR(30) | NOT NULL DEFAULT 'ACTIVE' | Account state |

#### Table 3: `complaints`
| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Primary Key |
| `public_id` | VARCHAR(50) | NOT NULL, UNIQUE | Unique identifier |
| `complaint_number` | VARCHAR(30) | NOT NULL, UNIQUE | e.g. `CS-2026-100001` |
| `user_id` | BIGINT | FOREIGN KEY (`users.id`) | Reporter ID |
| `title` | VARCHAR(200) | NOT NULL | Incident title |
| `description` | TEXT | NOT NULL | Incident details |
| `category` | VARCHAR(100) | NOT NULL | Threat category |
| `threat_type` | VARCHAR(100) | NOT NULL | Specific vector |
| `severity` | VARCHAR(20) | DEFAULT 'MEDIUM' | LOW / MEDIUM / HIGH / CRITICAL |
| `status` | VARCHAR(30) | DEFAULT 'SUBMITTED' | SUBMITTED, ASSIGNED, UNDER_INVESTIGATION, RESOLVED |
| `financial_loss` | DECIMAL(15,2)| DEFAULT 0.00 | Monetary impact |
| `suspicious_url` | TEXT | NULL | Phishing URL |
| `attacker_information` | TEXT | NULL | Scammer VPA / Phone |
| `resolution_verdict` | VARCHAR(150)| NULL | Conclusive verdict |
| `resolution_summary` | TEXT | NULL | Forensic findings |
| `actions_taken_summary`| TEXT | NULL | Enforcement actions |
| `citizen_guidance` | TEXT | NULL | Security instructions |
| `resolved_at` | TIMESTAMP | NULL | Closure timestamp |

#### Table 4: `investigation_notes`
| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Note ID |
| `complaint_id` | BIGINT | FOREIGN KEY (`complaints.id`) | Complaint reference |
| `investigator_id`| BIGINT | FOREIGN KEY (`users.id`) | Investigator reference |
| `note` | TEXT | NOT NULL | Formal note |
| `finding` | TEXT | NULL | Forensic discovery |
| `action_taken` | TEXT | NULL | Action executed |
| `recommendation`| TEXT | NULL | Recommendation |

#### Table 5: `case_messages`
| Field | Type | Constraint | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Message ID |
| `complaint_id` | BIGINT | FOREIGN KEY (`complaints.id`) | Complaint reference |
| `sender_id` | BIGINT | FOREIGN KEY (`users.id`) | Sender user reference |
| `message` | TEXT | NOT NULL | Chat content |
| `sender_role` | VARCHAR(50) | NOT NULL | Role tag |
| `attachment_name`| VARCHAR(200)| NULL | Log artifact name |
| `attachment_data`| TEXT | NULL | Terminal/scan snippet |

---

## 9. Key Source Code Highlights

### Pure JDBC Connection Provider (`DBConnection.java`)
```java
public class DBConnection {
    private static final String MYSQL_DRIVER = "com.mysql.cj.jdbc.Driver";
    private static final String MYSQL_URL = "jdbc:mysql://localhost:3306/cybershield_db?useSSL=false&serverTimezone=UTC";
    
    public static Connection getConnection() throws SQLException, ClassNotFoundException {
        Class.forName(MYSQL_DRIVER);
        return DriverManager.getConnection(MYSQL_URL, "root", "");
    }
}
```

### Demonstration of CRUD in `ComplaintDAO.java`
* **Create (Insert)**: `ps = conn.prepareStatement("INSERT INTO complaints (...) VALUES (...)");`
* **Read (Select)**: `ps = conn.prepareStatement("SELECT * FROM complaints WHERE user_id = ?"); rs = ps.executeQuery();`
* **Update (Assign / Resolve)**: `ps = conn.prepareStatement("UPDATE complaints SET status = 'RESOLVED', resolution_verdict = ? WHERE id = ?");`
* **Delete (Remove)**: `ps = conn.prepareStatement("DELETE FROM complaints WHERE id = ?");`

### Demonstration of GET and POST in `ComplaintServlet.java`
```java
@WebServlet(name = "ComplaintServlet", urlPatterns = {"/portal/complaints"})
public class ComplaintServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle read operations and JSP forwarding
        List<ComplaintBean> complaints = complaintDAO.getComplaintsByUserId(user.getId());
        request.setAttribute("complaints", complaints);
        request.getRequestDispatcher("/WEB-INF/views/myComplaints.jsp").forward(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // Handle incident creation form submission
        complaintDAO.createComplaint(complaintBean);
        response.sendRedirect(request.getContextPath() + "/portal/complaints?success=created");
    }
}
```

---

## 10. Testing and Results

| Test Case ID | Test Scenario | Input Data | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-01** | Citizen Registration | Valid user details | Account inserted in MySQL `users` table | Record created, redirected to login | **PASS** |
| **TC-02** | Clearance Code Check | Admin login with code `MAIN` | Clearance granted | Redirected to Admin SOC Triage | **PASS** |
| **TC-03** | Clearance Failure | Admin login with invalid code `XYZ` | Access denied alarm | Error displayed on login page | **PASS** |
| **TC-04** | File Complaint (CREATE) | Title, Phishing URL, loss Rs 25,000 | Record created with sequential ID | Generated `CS-2026-XXXXXX` | **PASS** |
| **TC-05** | View Complaints (READ) | Citizen logs in | Complaints list rendered dynamically | Rendered in `myComplaints.jsp` | **PASS** |
| **TC-06** | Assign Investigator (UPDATE) | Admin selects investigator | Status changes to `ASSIGNED` in DB | Case appears in investigator queue | **PASS** |
| **TC-07** | Linux Terminal Execution | Type `nmap target` | Terminal parses and outputs open ports | Formatted scan report printed | **PASS** |
| **TC-08** | Conclude Case (UPDATE) | Investigator submits resolution | Status becomes `RESOLVED`, verdict stored | Official Resolution Report displayed | **PASS** |
| **TC-09** | Case Chat Communication | Citizen & Investigator send chat | Messages stored in `case_messages` | Real-time chat dialogue synced | **PASS** |
| **TC-10** | Withdraw Complaint (DELETE) | Citizen clicks Delete on case | Record removed from MySQL | Removed from table | **PASS** |

---

## 11. Conclusion
The **CyberShield Online Complaint Management System** successfully fulfills all academic and technical requirements prescribed in the MCA – II Year Advanced Programming in Java group assignment rubric:
1. Integrated **HTML, CSS, Java Servlet, JSP, JDBC, and MySQL**.
2. Fully demonstrated **GET and POST** request handling via `HttpServlet`.
3. Executed complete **CRUD operations** (Create, Read, Update, Delete) via JDBC `PreparedStatement`.
4. Successfully integrated the real-world cyber crime workflow connecting the Citizen reporter, SOC Administrator, and Forensic Investigator.
5. Delivered an interactive **Investigator Workspace** with terminal commands, hacking tools hub, resolution reporting, and encrypted chat room communication.
