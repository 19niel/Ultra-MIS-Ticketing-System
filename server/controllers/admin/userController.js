  import { db } from "../../db.js";

  export const getAllUsers = async (req, res) => {
    try {
      const [rows] = await db.query(
        `SELECT 
          user_id,
          first_name,
          last_name,
          email,
          position,
          role_id,
          employee_id,
          department_id,
          branch_id
        FROM users`
      );

      res.json(rows);
    } catch (err) {
      console.error("Get users error:", err);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const addUser = async (req, res) => {
    try {
      // 1. Add branch_id to the destructuring
      const { 
        employee_id, 
        first_name, 
        last_name, 
        position, 
        department_id, 
        branch_id, // Add this
        role_id, 
        email, 
        password, 
        is_active = true 
      } = req.body;

      // 2. Update the SQL columns and values
      const [result] = await db.query(
        `INSERT INTO users 
        (employee_id, first_name, last_name, position, department_id, branch_id, role_id, email, password_hash, is_active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, // Add one more "?"
        [employee_id, first_name, last_name, position, department_id, branch_id, role_id, email, password, is_active]
      );

      res.status(201).json({ message: "User added", user_id: result.insertId });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email or employee ID exists" });
      res.status(500).json({ message: "Server error" });
    }
  };

  export const updateUser = async (req, res) => {
    try {
      const { id } = req.params; 
      const {
        employee_id,
        first_name,
        last_name,
        position,
        department_id,
        branch_id, // Destructured
        role_id,
        email,
        is_active,
      } = req.body;

      await db.query(
        `UPDATE users SET
          employee_id = ?,
          first_name = ?,
          last_name = ?,
          position = ?,
          department_id = ?,
          branch_id = ?,
          role_id = ?,
          email = ?,
          is_active = ?
        WHERE user_id = ?`,
        // Ensure branch_id is in the correct order here:
        [employee_id, first_name, last_name, position, department_id, branch_id, role_id, email, is_active, id]
      );

      res.json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const deleteUser = async (req, res) => {
      try {
        const { id } = req.params;
        await db.query("DELETE FROM users WHERE user_id = ?", [id]);
        res.json({ message: "User deleted" });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
    };