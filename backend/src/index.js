import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? true // allow Render domain
        : "http://localhost:5173",
    credentials: true,
  })
);

// ---------------- API ROUTES ----------------
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// ---------------- FRONTEND (PRODUCTION) ----------------
if (process.env.NODE_ENV === "production") {
  // Serve static files
  app.use(express.static(path.join(__dirname, "frontend", "dist")));

  // SPA catch-all (NO app.get("*"))
  app.use((req, res) => {
    res.sendFile(
      path.join(__dirname, "frontend", "dist", "index.html")
    );
  });
}

// ---------------- START SERVER ----------------
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
