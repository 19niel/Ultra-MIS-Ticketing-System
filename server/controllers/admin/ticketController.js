import { db } from "../../db.js";

export const getAllTickets = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        t.ticket_id,
        t.ticket_number,
        t.subject,
        t.description,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
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

// 🔔 Socket-Enabled Status Update
export const changeTicketStatus = async (req, res) => {
  try {
    const io = req.app.get("io"); // Get socket.io instance
    const { ticket_id } = req.params;
    const { status_id } = req.body;

    if (!status_id) return res.status(400).json({ message: "status_id is required" });

    const isClosed = Number(status_id) === 5;
    const closedAt = isClosed ? new Date() : null;

    const sql = `
      UPDATE tickets
      SET status_id = ?, closed_at = ?, updated_at = CURRENT_TIMESTAMP
      WHERE ticket_id = ?
    `;

    const [result] = await db.query(sql, [status_id, closedAt, ticket_id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: "Ticket not found" });

    // Fetch updated ticket info for frontend
    const [[ticket]] = await db.query(`
      SELECT 
        t.ticket_id,
        t.ticket_number,
        t.subject,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
        CONCAT(assignee.first_name, ' ', assignee.last_name) AS assigned_to,
        s.status_name AS status,
        p.priority_name AS priority,
        c.category_name AS category,
        t.updated_at
      FROM tickets t
      LEFT JOIN users creator ON t.created_by = creator.employee_id
      LEFT JOIN users assignee ON t.assigned_to = assignee.employee_id
      LEFT JOIN ticket_status s ON t.status_id = s.status_id
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      LEFT JOIN categories c ON t.category_id = c.category_id
      WHERE t.ticket_id = ?
    `, [ticket_id]);

    // 🔔 Emit event to all clients
    io.emit("ticket:statusUpdated", ticket);

    res.json({ message: "Ticket status updated successfully", ticket_number: ticket.ticket_number });

  } catch (err) {
    console.error("Change status error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// 🔔 Socket-Enabled Ticket Creation
export const createTicket = async (req, res) => {
  try {
    const io = req.app.get("io"); // Get socket.io instance

    const {
      ticket_number,
      subject,
      description,
      created_by,
      assigned_to,
      status_id,
      priority_id,
      category_id,
      closed_at_id,
    } = req.body;

    const sql = `
      INSERT INTO tickets (
        ticket_number, subject, description,
        created_by, assigned_to, status_id, priority_id,
        category_id, closed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      ticket_number,
      subject,
      description,
      created_by,
      assigned_to,
      status_id,
      priority_id,
      category_id,
      closed_at_id ?? null,
    ];

    const [result] = await db.query(sql, values);

    // Fetch full ticket info for frontend
    const [[newTicket]] = await db.query(`
      SELECT 
        t.ticket_id,
        t.ticket_number,
        t.subject,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
        CONCAT(assignee.first_name, ' ', assignee.last_name) AS assigned_to,
        s.status_name AS status,
        p.priority_name AS priority,
        c.category_name AS category,
        t.created_at
      FROM tickets t
      LEFT JOIN users creator ON t.created_by = creator.employee_id
      LEFT JOIN users assignee ON t.assigned_to = assignee.employee_id
      LEFT JOIN ticket_status s ON t.status_id = s.status_id
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      LEFT JOIN categories c ON t.category_id = c.category_id
      WHERE t.ticket_id = ?
    `, [result.insertId]);

    // 🔔 Emit event
    io.emit("ticket:new", newTicket);

    res.status(201).json({
      message: "Ticket created successfully",
      ticket_id: result.insertId,
      ticket_number,
    });

  } catch (err) {
    console.error("Create ticket error:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getLatestTicketNumber = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT ticket_number FROM tickets ORDER BY ticket_id DESC LIMIT 1"
    );
    const latestTicketNumber = rows.length ? rows[0].ticket_number : "TKT-0000000";
    res.json({ latestTicketNumber });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getSupportUsers = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT employee_id, first_name, last_name FROM users WHERE role_id = 2"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAssignment = async (req, res) => {
  const { ticket_id } = req.params;
  const { assigned_to } = req.body;

  try {
    await db.query(
      "UPDATE tickets SET assigned_to = ? WHERE ticket_id = ?",
      [assigned_to, ticket_id]
    );

    // 🔔 Emit the assignment change
    const io = req.app.get("io");
    io.emit("ticket:assignee:updated", {
      ticket_id,
      assigned_to, // employee_id
    });

    res.json({ message: "Assignment updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePriority = async (req, res) => {
  try {
    const io = req.app.get("io");
    const { ticket_id } = req.params;
    const { priority_id } = req.body;

    if (!priority_id) return res.status(400).json({ message: "priority_id is required" });

    // Update ticket
    await db.query("UPDATE tickets SET priority_id = ?, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = ?", [priority_id, ticket_id]);

    // Fetch updated ticket priority name
    const [[ticket]] = await db.query(`
      SELECT p.priority_name
      FROM tickets t
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      WHERE t.ticket_id = ?
    `, [ticket_id]);

    // Emit socket event
    io.emit("ticket:priorityUpdated", { ticket_id, priority_name: ticket.priority_name });

    res.json({ message: "Priority updated successfully", ticket_id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update priority" });
  }
};