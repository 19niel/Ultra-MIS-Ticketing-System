import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";

// Routes
import authRoutes from "./routes/admin/authRoutes.js";
import userRoutes from "./routes/admin/userRoutes.js";
import ticketRoutes from "./routes/admin/ticketRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// 🔌 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Make io accessible in routes/controllers
app.set("io", io);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);

// 🔔 Socket.IO connection
io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
