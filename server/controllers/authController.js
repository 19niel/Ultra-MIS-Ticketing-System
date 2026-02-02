import { db } from "../db.js";

// Demo login controller
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];

    // DEMO ONLY: fixed password
    if (password !== "1234") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // ✅ include first_name, last_name, and position in cookie
    res.cookie(
      "session",
      JSON.stringify({
        user_id: user.user_id,
        role_id: user.role_id,
        employee_id: user.employee_id,
        first_name: user.first_name,
        last_name: user.last_name,
        position: user.position || "", // ensure position exists in DB
      }),
      {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000,
      }
    );

    res.json({
      message: "Login successful",
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        role_id: user.role_id,
        employee_id: user.employee_id,
        position: user.position || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Demo 'me' endpoint
export const me = (req, res) => {
  const session = req.cookies.session;

  if (!session) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const user = JSON.parse(session); // now includes first_name, last_name, position
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid session" });
  }
};

// Demo logout
export const logout = (req, res) => {
  res.clearCookie("session");
  res.json({ message: "Logged out" });
};
