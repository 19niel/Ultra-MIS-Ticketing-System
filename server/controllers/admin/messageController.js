import { db } from "../../db.js"

// Fetch all messages for a specific ticket
export const getTicketMessages = async (req, res) => {
  const { ticket_id } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT 
        m.message_id, 
        m.message, 
        m.created_at, 
        m.user_id, -- Added this to compare IDs in the frontend
        u.first_name, 
        u.last_name, 
        r.role_name as senderRole
       FROM ticket_messages m
       JOIN users u ON m.user_id = u.user_id
       JOIN roles r ON u.role_id = r.role_id
       WHERE m.ticket_id = ?
       ORDER BY m.created_at ASC`,
      [ticket_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Save a new message
export const createMessage = async (req, res) => {
  const { ticket_id, user_id, message } = req.body;

  try {
    const [result] = await db.query(
      "INSERT INTO ticket_messages (ticket_id, user_id, message) VALUES (?, ?, ?)",
      [ticket_id, user_id, message]
    );

    const newId = result ? result.insertId : null;

    // 🔔 Emit the new message via socket
    const io = req.app.get("io"); // make sure your server sets io in app
    io.emit("ticket:message:new", {
      ticket_id,
      message_id: newId,
      user_id,
      message,
      created_at: new Date(),
    });

    res.json({
      success: true,
      message_id: newId,
      message: "Message sent",
    });
  } catch (err) {
    console.error("DATABASE ERROR:", err);
    res.status(500).json({ error: err.sqlMessage || err.message });
  }
};