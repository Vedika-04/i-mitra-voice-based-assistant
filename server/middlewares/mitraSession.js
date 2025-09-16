import jwt from "jsonwebtoken";

// Middleware to attach mitraContext from JWT in cookie
export function requireMitraAuth(req, res, next) {
  const token = req.cookies?.mitra_token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated [mitra]" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.MITRA_JWT_SECRET || "mitra-secret"
    );

    // Attach context
    req.mitraContext = decoded; // { mitraId, mobile, departmentName, zone, fullName }
    req.mitraId = decoded.mitraId;

    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid mitra session" });
  }
}
