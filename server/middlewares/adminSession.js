import jwt from "jsonwebtoken";

export function requireAdminAuth(req, res, next) {
  const token = req.cookies?.admin_token;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated [admin]" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ADMIN_JWT_SECRET || "admin-secret"
    );

    if (!decoded?.admin) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: admin role required" });
    }

    // attach minimal context
    req.admin = {
      username: decoded.username || "admin",
    };

    return next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid admin session" });
  }
}
