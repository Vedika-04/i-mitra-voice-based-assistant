import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { requireDepartmentAuth } from "../middlewares/departmentSession.js";
dotenv.config();

// The hardcoded department list
const DEPARTMENTS = [
  "Water Supply",
  "Health and Medical",
  "Sanitation",
  "Electricity",
  "Road and Transport",
  "Education",
  "Other",
];

const DEPT_SHARED_PASSWORD = process.env.DEPT_SHARED_PASSWORD || "changeme";

const router = express.Router();

function extractDeptName(username) {
  if (!username.endsWith("@admin")) return "";
  return username.slice(0, -6);
}

// POST /api/v1/department/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ success: false, message: "Username and password are required" });

  const deptName = extractDeptName(username);
  if (!deptName || !DEPARTMENTS.includes(deptName))
    return res
      .status(401)
      .json({ success: false, message: "Invalid department name" });

  if (password !== DEPT_SHARED_PASSWORD)
    return res
      .status(401)
      .json({ success: false, message: "Invalid password" });

  // Issue JWT token containing department context
  const token = jwt.sign(
    { deptContext: deptName },
    process.env.DEPT_JWT_SECRET || "dept-secret",
    { expiresIn: "1d" }
  );

  // Send as department cookie (separate from citizen)
  res.cookie("dept_token", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 10 * 60 * 60 * 1000, // 10 hours
  });

  res.json({
    success: true,
    department: deptName,
    token,
    message: "Department login successful",
  });
});

// Logout endpoint to clear cookie

// router.get("/logout", (req, res) => {
//   res.cookie("dept_token", "", { expires: new Date(0), httpOnly: true });
//   res.json({ success: true, message: "Department logged out" });
// });

router.get("/logout", (req, res) => {
  try {
    const token = req.cookies?.dept_token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No active department session" });
    }

    // Verify token
    jwt.verify(
      token,
      process.env.DEPT_JWT_SECRET || "dept-secret",
      (err, decoded) => {
        if (err) {
          return res
            .status(401)
            .json({ success: false, message: "Invalid or expired session" });
        }

        // Clear cookie
        res.cookie("dept_token", "", {
          httpOnly: true,
          sameSite: "lax",
          expires: new Date(0),
        });

        res.json({
          success: true,
          department: decoded.deptContext,
          message: "Department logged out successfully",
        });
      }
    );
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: err.message,
    });
  }
});

router.get("/me", requireDepartmentAuth, (req, res) => {
  res.json({ success: true, department: req.deptContext });
});

export default router;
