import { db } from "../../db.js";

export const getTicketReports = async (req, res) => {
  try {
    const { category, branch, department, is_resolved, dateRange } = req.query;

    let whereClauses = ["1=1"];
    let params = [];

    // Filters
    if (category && category !== "all") {
      whereClauses.push("c.category_name = ?");
      params.push(category);
    }
    if (branch && branch !== "all") {
      whereClauses.push("t.branch_id = ?");
      params.push(branch);
    }
    if (department && department !== "all") {
      whereClauses.push("t.department_id = ?");
      params.push(department);
    }
    if (is_resolved !== undefined && is_resolved !== "all") {
      whereClauses.push("t.is_resolved = ?");
      params.push(is_resolved === "resolved" ? 1 : 0);
    }

    // Date Filtering
    if (dateRange && dateRange !== "all") {
      if (dateRange === "today") whereClauses.push("DATE(t.created_at) = CURDATE()");
      else if (dateRange === "week") whereClauses.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)");
      else if (dateRange === "month") whereClauses.push("t.created_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)");
    }

    const whereSql = `WHERE ${whereClauses.join(" AND ")}`;

    // Query to get count grouped by category
    // This provides data for the Bar Chart
    const [chartData] = await db.query(`
      SELECT 
        c.category_name as name, 
        COUNT(t.ticket_id) as total
      FROM categories c
      LEFT JOIN tickets t ON c.category_id = t.category_id
      ${whereSql}
      GROUP BY c.category_name
    `, params);

    // Query for Summary Cards
    const [summary] = await db.query(`
      SELECT 
        COUNT(*) as totalTickets,
        COUNT(CASE WHEN is_resolved = 1 THEN 1 END) as resolved,
        COUNT(CASE WHEN is_resolved = 0 THEN 1 END) as failed,
        COUNT(CASE WHEN status_id = 1 THEN 1 END) as open
      FROM tickets t
      LEFT JOIN categories c ON t.category_id = c.category_id
      ${whereSql}
    `, params);

    res.json({
      chartData,
      summary: summary[0]
    });
  } catch (err) {
    console.error("Reports Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};