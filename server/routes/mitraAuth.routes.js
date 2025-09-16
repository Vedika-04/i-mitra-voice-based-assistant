// // routes/mitraAuth.routes.js
// import express from "express";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";
// import { Mitra } from "../models/mitra.model.js";
// dotenv.config();

// const router = express.Router();

// const MITRA_SHARED_PASSWORD = process.env.MITRA_SHARED_PASSWORD || "changeme";
// const MITRA_JWT_SECRET = process.env.MITRA_JWT_SECRET || "mitra-secret";

// // Normalize to +91XXXXXXXXXX (10 digits)
// function normalizeMobile(raw) {
//   if (!raw) return "";
//   const digits = String(raw).replace(/\D/g, ""); // keep only numbers
//   const last10 = digits.slice(-10); // last 10 digits
//   if (last10.length !== 10) return "";
//   return `+91${last10}`;
// }

// // POST /api/v1/mitra/auth/login
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body; // username = mobile
//     if (!username || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "Username (mobile) and password are required",
//       });
//     }

//     const mobile = normalizeMobile(username);
//     if (!mobile) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid mobile format. Use +91 and 10 digits",
//       });
//     }

//     if (password !== MITRA_SHARED_PASSWORD) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Invalid password" });
//     }

//     const mitra = await Mitra.findOne({ mobile }).lean();
//     if (!mitra) {
//       return res
//         .status(401)
//         .json({ success: false, message: "Mitra not found" });
//     }
//     if (mitra.isActive === false) {
//       return res
//         .status(403)
//         .json({ success: false, message: "Mitra account is inactive" });
//     }

//     const payload = {
//       mitraId: mitra._id,
//       mobile: mitra.mobile,
//       fullName: mitra.fullName,
//       departmentName: mitra.departmentName,
//       zone: mitra.zone,
//     };

//     const token = jwt.sign(payload, MITRA_JWT_SECRET, { expiresIn: "1d" });

//     res.cookie("mitra_token", token, {
//       httpOnly: true,
//       sameSite: "lax",
//       maxAge: 10 * 60 * 60 * 1000, // 10 hours
//     });

//     res.json({
//       success: true,
//       mitra: payload,
//       token,
//       message: "Mitra login successful",
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // GET /api/v1/mitra/auth/logout
// router.get("/logout", (req, res) => {
//   try {
//     const token = req.cookies?.mitra_token;
//     if (!token) {
//       return res
//         .status(401)
//         .json({ success: false, message: "No active mitra session" });
//     }

//     jwt.verify(token, MITRA_JWT_SECRET, (err, decoded) => {
//       // token galat/expired ho to bhi cookie clear kar dena
//       res.cookie("mitra_token", "", {
//         httpOnly: true,
//         sameSite: "lax",
//         expires: new Date(0),
//       });

//       if (err) {
//         return res.status(401).json({
//           success: true,
//           message: "Session cleared (was invalid/expired)",
//         });
//       }

//       res.json({
//         success: true,
//         mitra: { mitraId: decoded.mitraId, mobile: decoded.mobile },
//         message: "Mitra logged out successfully",
//       });
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: "Server error during logout",
//       error: err.message,
//     });
//   }
// });

// export default router;

// routes/mitraAuth.routes.js
import express from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Mitra } from "../models/mitra.model.js";
import { requireMitraAuth } from "../middlewares/mitraSession.js";
dotenv.config();

const router = express.Router();

// Shared password and secret from env
const MITRA_SHARED_PASSWORD = process.env.MITRA_SHARED_PASSWORD || "changeme";
const MITRA_JWT_SECRET = process.env.MITRA_JWT_SECRET || "mitra-secret";

// Normalize to +91XXXXXXXXXX (10 digits)
function normalizeMobile(raw) {
  if (!raw) return "";
  const digits = String(raw).replace(/\D/g, ""); // keep only numbers
  const last10 = digits.slice(-10); // last 10 digits
  if (last10.length !== 10) return "";
  return `+91${last10}`;
}

// In your mitra routes
router.get("/me", requireMitraAuth, (req, res) => {
  try {
    const mitraContext = req.mitraContext;
    res.json({
      success: true,
      mitra: mitraContext,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/v1/mitra/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body; // username = mobile

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username (mobile) and password are required",
      });
    }

    const mobile = normalizeMobile(username);
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile format. Use +91 and 10 digits",
      });
    }

    if (password !== MITRA_SHARED_PASSWORD) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const mitra = await Mitra.findOne({ mobile }).lean();
    if (!mitra) {
      return res
        .status(401)
        .json({ success: false, message: "Mitra not found" });
    }
    if (mitra.isActive === false) {
      return res
        .status(403)
        .json({ success: false, message: "Mitra account is inactive" });
    }

    // JWT payload
    const payload = {
      mitraId: mitra._id,
      mobile: mitra.mobile,
      fullName: mitra.fullName,
      departmentName: mitra.departmentName,
      zone: mitra.zone,
      profileImg: mitra.profileImg,
    };

    const token = jwt.sign(payload, MITRA_JWT_SECRET, { expiresIn: "1d" });

    // Send cookie
    res.cookie("mitra_token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 10 * 60 * 60 * 1000, // 10 hours
    });

    res.json({
      success: true,
      mitra: payload,
      token,
      message: "Mitra login successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: err.message,
    });
  }
});

// GET /api/v1/mitra/auth/logout
router.get("/logout", (req, res) => {
  try {
    const token = req.cookies?.mitra_token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No active mitra session" });
    }

    jwt.verify(token, MITRA_JWT_SECRET, (err, decoded) => {
      // Always clear cookie (even if expired/invalid)
      res.cookie("mitra_token", "", {
        httpOnly: true,
        sameSite: "lax",
        expires: new Date(0),
      });

      if (err) {
        return res.status(401).json({
          success: true,
          message: "Session cleared (was invalid/expired)",
        });
      }

      res.json({
        success: true,
        mitra: { mitraId: decoded.mitraId, mobile: decoded.mobile },
        message: "Mitra logged out successfully",
      });
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error during logout",
      error: err.message,
    });
  }
});

export default router;
