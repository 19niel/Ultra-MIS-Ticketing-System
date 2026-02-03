  import { db } from "../../db.js";

  export const getAllUsers = async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT 
          user_id,
          first_name,
          last_name,
          email,
          role_id,
          employee_id
        FROM users`
      );

      res.json(rows);
    } catch (err) {
      console.error("Get users error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
