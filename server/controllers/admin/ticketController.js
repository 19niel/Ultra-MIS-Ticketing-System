import { db } from "../../db.js";

export const getAllTickets = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const status = req.query.status || "all";
    const priority = req.query.priority || "all";
    const dateRange = req.query.dateRange || "all";

    let whereClauses = [];
    let params = [];

    // 1. Search Logic
    if (search) {
      whereClauses.push("(t.ticket_number LIKE ? OR t.subject LIKE ? OR creator.first_name LIKE ?)");
      const searchVal = `%${search}%`;
      params.push(searchVal, searchVal, searchVal);
    }

    // 2. Status Logic
    if (status !== "all") {
      whereClauses.push("s.status_name = ?");
      params.push(status);
    }

    // 3. Priority Logic
    if (priority !== "all") {
      whereClauses.push("p.priority_name = ?");
      params.push(priority);
    }

    // 4. Date Range Logic
    if (dateRange !== "all") {
      if (dateRange === "today") {
        whereClauses.push("t.created_at >= CURDATE()");
      } else if (dateRange === "week") {
        whereClauses.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
      } else if (dateRange === "month") {
        whereClauses.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
      }
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // 5. Get Total Count
    const [countRows] = await db.query(`
      SELECT COUNT(*) as total FROM tickets t
      LEFT JOIN users creator ON t.created_by = creator.employee_id
      LEFT JOIN ticket_status s ON t.status_id = s.status_id
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      ${whereSql}
    `, params);

    const totalTickets = countRows[0].total;

    // 6. Get Paginated Data (Updated with Department and Branch IDs)
    const [rows] = await db.query(`
      SELECT
        t.ticket_id, 
        t.ticket_number, 
        t.subject, 
        t.description,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
        CONCAT(assignee.first_name, ' ', assignee.last_name) AS assigned_to,
        
        /* Added these two lines to get the IDs for your frontend mapping */
        creator.department_id, 
        creator.branch_id,
        
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
      ${whereSql}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    res.json({
      tickets: rows,
      totalTickets,
      totalPages: Math.ceil(totalTickets / limit),
      currentPage: page
    });
  } catch (err) {
    console.error("SQL Error:", err);
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
      department_id,
      branch_id,
      closed_at_id,
    } = req.body;

    const sql = `
      INSERT INTO tickets (
        ticket_number, subject, description,
        created_by, assigned_to, status_id, priority_id,
        category_id, department_id, branch_id, closed_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`; // 11 placeholders for 11 columns

    const values = [
      ticket_number,
      subject,
      description,
      created_by,
      assigned_to || null,
      status_id,
      priority_id,
      category_id,
      department_id,
      branch_id,
      closed_at_id || null,
    ];

    const [result] = await db.query(sql, values);

    // Fetch full ticket info for frontend (Fixed the Branch Join)
    const [[newTicket]] = await db.query(`
      SELECT 
        t.ticket_id, t.ticket_number, t.subject,
        CONCAT(creator.first_name, ' ', creator.last_name) AS created_by,
        CONCAT(assignee.first_name, ' ', assignee.last_name) AS assigned_to,
        s.status_name AS status,
        p.priority_name AS priority,
        c.category_name AS category,
        d.department_name AS department,
        b.branch_name AS branch,
        t.created_at
      FROM tickets t
      LEFT JOIN users creator ON t.created_by = creator.employee_id
      LEFT JOIN users assignee ON t.assigned_to = assignee.employee_id
      LEFT JOIN ticket_status s ON t.status_id = s.status_id
      LEFT JOIN priorities p ON t.priority_id = p.priority_id
      LEFT JOIN categories c ON t.category_id = c.category_id
      LEFT JOIN departments d ON t.department_id = d.department_id
      LEFT JOIN branches b ON t.branch_id = b.branch_id
      WHERE t.ticket_id = ?
    `, [result.insertId]);

    if (io) io.emit("ticket:new", newTicket);

    res.status(201).json({ message: "Ticket created successfully", ticket_id: result.insertId });
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
  const { assigned_to } = req.body; // This is the employee_id

  try {
    await db.query(
      "UPDATE tickets SET assigned_to = ? WHERE ticket_id = ?",
      [assigned_to, ticket_id]
    );

    // Fetch the name of the new assignee to send to the frontend
    const [[assignee]] = await db.query(
      "SELECT first_name, last_name FROM users WHERE employee_id = ?",
      [assigned_to]
    );

    const fullName = assignee ? `${assignee.first_name} ${assignee.last_name}` : "Unassigned";

    // 🔔 Emit the assignment change with the name
    const io = req.app.get("io");
    io.emit("ticket:assigneeUpdated", {
      ticket_id: parseInt(ticket_id),
      assigned_to: fullName, 
    });

    res.json({ message: "Assignment updated", assigned_to: fullName });
  } catch (err) {
    console.error("Update assignment error:", err);
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
    const [result] = await db.query(
      "UPDATE tickets SET priority_id = ?, updated_at = CURRENT_TIMESTAMP WHERE ticket_id = ?", 
      [priority_id, ticket_id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: "Ticket not found" });

    // Fetch updated ticket info with joins for the frontend list
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

    // 🔔 Emit event to all clients - matching the frontend listener
    io.emit("ticket:priorityUpdated", ticket);

    res.json({ 
      message: "Priority updated successfully", 
      ticket_number: ticket.ticket_number,
      priority: ticket.priority 
    });

  } catch (err) {
    console.error("Update priority error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};