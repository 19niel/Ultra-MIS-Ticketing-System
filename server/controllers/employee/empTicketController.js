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

    if (req.query.search) {
      whereClauses.push("(t.subject LIKE ? OR t.ticket_number LIKE ?)");
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    
    const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

    // UPDATED QUERY BELOW
    const [rows] = await db.query(`
      SELECT 
        t.ticket_id, t.ticket_number, t.subject, t.description,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
        s.status_name AS status, 
        p.priority_name AS priority,
        c.category_name AS category,
        t.created_at, t.updated_at
      FROM tickets t
      LEFT JOIN users creator ON t.created_by = creator.employee_id
      LEFT JOIN ticket_status s ON t.status_id = s.status_id
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      LEFT JOIN categories c ON t.category_id = c.category_id
      ${whereSql}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const [countRows] = await db.query(
      `SELECT COUNT(*) as total FROM tickets t ${whereSql}`, 
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

// empTicketController.js
export const getEmployeeDashboardStats = async (req, res) => {
  try {
    const { emp_id } = req.params;
    
    // Using CURDATE() for more reliable daily filtering
    const [rows] = await db.execute(`
      SELECT 
        COUNT(CASE WHEN created_by = ? AND status_id IN (1, 2, 3) THEN 1 END) as my_pending,
        COUNT(CASE WHEN created_by = ? AND DATE(created_at) = CURDATE() THEN 1 END) as my_today,
        COUNT(CASE WHEN created_by = ? AND status_id = 4 THEN 1 END) as my_resolved,
        COUNT(CASE WHEN created_by = ? AND status_id = 6 THEN 1 END) as my_failed,
        COUNT(CASE WHEN created_by = ? THEN 1 END) as my_total
      FROM tickets
    `, [emp_id, emp_id, emp_id, emp_id, emp_id]);

    res.json(rows[0]);
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    res.status(500).json({ error: error.message });
  }
};