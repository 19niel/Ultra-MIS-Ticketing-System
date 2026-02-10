import { db } from "../../db.js";

// Get Only the tickets of the user based on their employee ID 
export const getMyTickets = async (req, res) => {
  try {
    // 🧪 STATIC TEST VALUE
    const empId = req.query.empId;
    
    console.log(`DEBUG: Testing fetch for static employee ID: ${empId}`);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Hardcoded filter
    let whereClauses = ["t.created_by = ?"];
    let params = [empId]; 

    // Keep your search logic so you can test if search works with the static ID
    if (req.query.search) {
      whereClauses.push("(t.subject LIKE ? OR t.ticket_number LIKE ?)");
      params.push(`%${req.query.search}%`, `%${req.query.search}%`);
    }
    
    const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

    const [rows] = await db.query(`
      SELECT 
        t.*, 
        s.status_name AS status, 
        p.priority_name AS priority,
        c.category_name AS category
      FROM tickets t
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
    console.error("SQL Error during test:", err);
    res.status(500).json({ message: "Test failed" });
  }
};