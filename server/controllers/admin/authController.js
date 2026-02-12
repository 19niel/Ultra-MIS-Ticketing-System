import { db } from "../../db.js";

// Login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    // 1. Fetch user by email
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // 2. Compare password with database column 'password_hash'
    // Note: Currently comparing as plain text per your request
    if (password !== user.password_hash) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Set the session cookie
    res.cookie(
      "session",
      JSON.stringify({
        user_id: user.user_id,
        role_id: user.role_id,
        employee_id: user.employee_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        position: user.position || "", 
        department_id: user.department_id,
        branch_id: user.branch_id
      }),
      {
        httpOnly: true,
        secure: false, // Set to true if using HTTPS
        maxAge: 24 * 60 * 60 * 1000,
      }
    );

    // 4. Send response
    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        employee_id: user.employee_id,
        email: user.email,
        position: user.position || "",
        department_id: user.department_id,
        branch_id: user.branch_id
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 'me' endpoint to check current session
export const me = (req, res) => {
  const session = req.cookies.session;

  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = JSON.parse(session);
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid session" });
  }
};

// Logout controller
export const logout = (req, res) => {
  res.clearCookie("session");
  res.json({ message: "Logged out" });
};