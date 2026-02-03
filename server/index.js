import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Admin
import authRoutes from "./routes/admin/authRoutes.js"
import userRoutes from "./routes/admin/userRoutes.js"
import ticketRoutes from "./routes/admin/ticketRoutes.js";

// Employee


// Tech Support

// import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Health check (important when debugging)
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
