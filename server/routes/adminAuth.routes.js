import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { requireAdminAuth } from "../middlewares/adminSession.js";

const router = express.Router();

// POST /api/v1/admin/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });
  }

  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "superadmin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
  const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-secret";
  const ADMIN_JWT_EXPIRE = process.env.ADMIN_JWT_EXPIRE || "1d";

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    { admin: true, username: ADMIN_USERNAME },
    ADMIN_JWT_SECRET,
    { expiresIn: ADMIN_JWT_EXPIRE }
  );

  res.cookie("admin_token", token, {
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // enable in production behind HTTPS
    maxAge: 24 * 60 * 60 * 1000, // align with JWT if you want; or rely on JWT exp
  });

  return res.json({
    success: true,
    message: "Admin login successful",
    token,
  });
});

// GET /api/v1/admin/auth/logout
router.get("/logout", (req, res) => {
  try {
    const token = req.cookies?.admin_token;
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No active admin session" });
    }

    const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-secret";

    jwt.verify(token, ADMIN_JWT_SECRET, (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid or expired session" });
      }

      res.cookie("admin_token", "", {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(0),
      });

      return res.json({
        success: true,
        message: "Admin logged out successfully",
        username: decoded?.username || "admin",
      });
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: err.message,
    });
  }
});

// GET /api/v1/admin/auth/me
router.get("/me", requireAdminAuth, (req, res) => {
  return res.json({
    success: true,
    admin: true,
    username: req.admin?.username || "admin",
  });
});

export default router;
