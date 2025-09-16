import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("User is not authenticated.", 400));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

export default {
  optionalAuth: (req, _res, next) => {
    // if token present & valid → req.user = { id: ... }
    // else → req.user = null
    // but always call next()
    try {
      // ... verify token if present
      req.user = req.user || null;
    } catch {
      req.user = null;
    }
    next();
  },
  authenticateToken: (req, res, next) => {
    // hard-require token
    // if invalid → 401
    // else → next()
  },
};
