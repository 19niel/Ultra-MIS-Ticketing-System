import { db } from "../../db.js";

// Get Only the tickets of the user based on their employee ID 
export const getMyTickets = async (req, res) => {
  try {
    const empId = req.query.empId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    let whereClauses = ["t.created_by = ?"];
    let params = [empId];

    // 1. Search Logic
    if (req.query.search) {
      whereClauses.push("(t.subject LIKE ? OR t.ticket_number LIKE ?)");
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }

    // 2. Status Filter
    if (req.query.status && req.query.status !== "all") {
      whereClauses.push("s.status_name = ?");
      params.push(req.query.status);
    }

    // 3. Priority Filter
    if (req.query.priority && req.query.priority !== "all") {
      whereClauses.push("p.priority_name = ?");
      params.push(req.query.priority);
    }

    // 4. Date Range Filter
    if (req.query.dateRange && req.query.dateRange !== "all") {
      if (req.query.dateRange === "today") {
        whereClauses.push("DATE(t.created_at) = CURDATE()");
      } else if (req.query.dateRange === "week") {
        whereClauses.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
      } else if (req.query.dateRange === "month") {
        whereClauses.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      }
    }

    const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

    // Main Query - ADDED is_resolved, department_id, and branch_id
    const [rows] = await db.query(`
    SELECT 
      t.ticket_id, 
      t.ticket_number, 
      t.subject, 
      t.description,
      t.is_resolved,
      t.department_id,
      t.branch_id,
      CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
      
      /* ADD THIS LINE TO GET THE ASSIGNEE NAME */
      CONCAT(assignee.first_name, ' ', assignee.last_name) AS assigned_to, 
      
      s.status_name AS status, 
      p.priority_name AS priority,
      c.category_name AS category,
      t.created_at, 
      t.updated_at
    FROM tickets t
    LEFT JOIN users creator ON t.created_by = creator.employee_id
    
    /* ADD THIS JOIN */
    LEFT JOIN users assignee ON t.assigned_to = assignee.employee_id 
    
    LEFT JOIN ticket_status s ON t.status_id = s.status_id
    LEFT JOIN priorities p ON t.priority_id = p.priority_id
    LEFT JOIN categories c ON t.category_id = c.category_id
    ${whereSql}
    ORDER BY t.created_at DESC
    LIMIT ? OFFSET ?
  `, [...params, limit, offset]);

    // Count Query
    const [countRows] = await db.query(
      `SELECT COUNT(*) as total 
       FROM tickets t 
       LEFT JOIN ticket_status s ON t.status_id = s.status_id
       ${whereSql}`, 
      params
    );

    res.json({
      tickets: rows,
      totalTickets: countRows[0].total,
      totalPages: Math.ceil(countRows[0].total / limit)
    });
  } catch (err) {
    console.error("SQL Error during fetch:", err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};

export const empcreateTicket = async (req, res) => {
  try {
    const io = req.app.get("io");

    const {
      ticket_number,
      subject,
      description,
      created_by,
      assigned_to,
      status_id,
      priority_id,
      category_id,
      branch_id,
      department_id, // Added this field
      closed_at_id,
    } = req.body;

    // Verify all mandatory fields are present
    if (!ticket_number || !subject || !created_by || !branch_id || !department_id) {
      return res.status(400).json({ error: "Missing required ticket information." });
    }

    const sql = `
      INSERT INTO tickets (
        ticket_number, subject, description,
        created_by, assigned_to, status_id, priority_id,
        category_id, branch_id, department_id, closed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      ticket_number,
      subject,
      description,
      created_by,
      assigned_to || null,
      status_id || 1,
      priority_id || 1, 
      category_id,
      branch_id,   
      department_id,
      closed_at_id || null,
    ];

    const [result] = await db.query(sql, values);

    // Fetch the newly created ticket to emit it via Socket.io
    const [newTicket] = await db.query("SELECT * FROM tickets WHERE id = ?", [result.insertId]);

    if (io) {
      io.emit("newTicket", newTicket[0]);
    }

    res.status(201).json({ message: "Ticket created successfully", ticket: newTicket[0] });

  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getEmployeeDashboardStats = async (req, res) => {
  try {
    const { emp_id } = req.params;
    
    // Using CURDATE() inside the query for accuracy
    const [rows] = await db.execute(`
      SELECT 
        -- 1. PENDING TODAY: Created TODAY AND not closed (Status 1, 2, or 3)
        COUNT(CASE WHEN created_by = ? AND DATE(created_at) = CURDATE() AND status_id IN (1, 2, 3) THEN 1 END) as pending_today,

        -- 2. CREATED TODAY: Total tickets submitted today regardless of status
        COUNT(CASE WHEN created_by = ? AND DATE(created_at) = CURDATE() THEN 1 END) as my_today,

        -- 3. STILL OPEN: Total accumulation of unresolved work (Backlog - Status 1, 2, 3)
        COUNT(CASE WHEN created_by = ? AND status_id IN (1, 2, 3) THEN 1 END) as still_open,

        -- 4. RESOLVED: Total Closed successfully (Status 4)
        COUNT(CASE WHEN created_by = ? AND status_id = 4 THEN 1 END) as my_resolved,

        -- 5. FAILED: Total Failed (Status 6)
        COUNT(CASE WHEN created_by = ? AND status_id = 6 THEN 1 END) as my_failed,

        -- 6. TOTAL: Every ticket ever created by this employee
        COUNT(CASE WHEN created_by = ? THEN 1 END) as my_total
      FROM tickets
    `, [emp_id, emp_id, emp_id, emp_id, emp_id, emp_id]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Employee Dashboard Stats Error:", error);
    res.status(500).json({ error: error.message });
  }
};