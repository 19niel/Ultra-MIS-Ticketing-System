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
      branch_id, // Added branch_id from request body
      closed_at_id,
    } = req.body;

    const sql = `
      INSERT INTO tickets (
        ticket_number, subject, description,
        created_by, assigned_to, status_id, priority_id,
        category_id, branch_id, closed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      ticket_number,
      subject,
      description,
      created_by,
      assigned_to,
      status_id,
      priority_id, // This will be the '1' we sent from frontend
      category_id,
      branch_id,   // Added to values array
      closed_at_id ?? null,
    ];

    const [result] = await db.query(sql, values);

    // ... (keep the SELECT and io.emit logic)

  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ error: err.message });
  }
};