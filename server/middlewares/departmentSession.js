import jwt from "jsonwebtoken";

// Middleware to attach deptContext from JWT in cookie
export function requireDepartmentAuth(req, res, next) {
  const token = req.cookies.dept_token;
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated [department]" });

  try {
    const decoded = jwt.verify(
      token,
      process.env.DEPT_JWT_SECRET || "dept-secret"
    );
    req.deptContext = decoded.deptContext;
    next();
  } catch (e) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid department session" });
  }
}
