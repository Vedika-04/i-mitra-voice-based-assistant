// import express from "express";
// import {
//   register,
//   verifyOTP,
//   login,
//   logout,
//   getUser,
//   forgotPassword,
//   resetPassword,
// } from "../controllers/userController.js";
// import { isAuthenticated } from "../middlewares/auth.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/otp-verification", verifyOTP);
// router.post("/login", login);
// router.get("/logout", isAuthenticated, logout);
// router.get("/me", isAuthenticated, getUser);
// router.post("/password/forgot", forgotPassword);
// router.put("/password/reset/:token", resetPassword);

// export default router;

import express from "express";
import {
  register,
  verifyOTP,
  login,
  logout,
  getUser,
  forgotPassword,
  resetPassword,
} from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/auth.js";

// Multer middleware import
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Registration route with profile image upload
router.post("/register", upload.single("profileimg"), register);

router.post("/otp-verification", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", resetPassword);

export default router;
