import { db } from "../../db.js";

export const getAllTickets = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.ticket_id,
        t.ticket_number,
        t.subject,
        t.description,

        -- creator: Combining first and last name from the users table
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,

        -- assigned tech: Combining first and last name from the users table
        CONCAT(assignee.first_name, ' ', assignee.last_name) AS assigned_to,

        s.status_name AS status,
        p.priority_name AS priority,
        c.category_name AS category,
        t.closed_at,
        t.created_at,
        t.updated_at

      FROM tickets t
      LEFT JOIN users creator ON t.created_by = creator.employee_id
      LEFT JOIN users assignee ON t.assigned_to = assignee.employee_id
      LEFT JOIN ticket_status s ON t.status_id = s.status_id
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      LEFT JOIN categories c ON t.category_id = c.category_id

      ORDER BY t.created_at DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch tickets" });
  }
};


export const changeTicketStatus = async (req, res) => {
  try {
    const { ticket_id } = req.params;
    const { status_id } = req.body;

    // Validate input
    if (!status_id) {
      return res.status(400).json({ message: "status_id is required" });
    }

    /* Updated Logic: 
      Based on your STATUS_ID_TO_NAME mapping:
      1: Open, 2: In Progress, 3: On Hold, 4: Resolved, 5: Closed, 6: Failed
    */
    const isClosed = Number(status_id) === 5; 
    const closedAt = isClosed ? new Date() : null;

    const sql = `
      UPDATE tickets
      SET
        status_id = ?,
        closed_at = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ?
    `;

    // Execute query
    const [result] = await db.query(sql, [
      status_id,
      closedAt,
      ticket_id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Optional: Fetch the ticket number to send back for a better toast message
    const [[ticket]] = await db.query("SELECT ticket_number FROM tickets WHERE ticket_id = ?", [ticket_id]);

    res.json({ 
      message: "Ticket status updated successfully",
      ticket_number: ticket?.ticket_number 
    });

  } catch (err) {
    console.error("Change status error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};