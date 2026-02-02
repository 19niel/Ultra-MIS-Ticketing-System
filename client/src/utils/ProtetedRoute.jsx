import { db } from "../db.js";
import jwt from "jsonwebtoken";

// LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1️⃣ Find user
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // 2️⃣ Check password (plain text for demo)
    if (user.password_hash !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3️⃣ Create JWT
    const token = jwt.sign(
      {
        user_id: user.user_id,
        role_id: user.role_id,
        employee_id: user.employee_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4️⃣ Store JWT in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // 5️⃣ Send user info (no password)
    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        employee_id: user.employee_id,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGOUT
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
};

// GET CURRENT USER (for protected routes)
export const me = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
