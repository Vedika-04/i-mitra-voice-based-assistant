import express from "express";
import { requireDepartmentAuth } from "../middlewares/departmentSession.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  registerMitra,
  listDepartmentMitras,
} from "../controllers/departmentMitra.controller.js";

const router = express.Router();

// Register new Mitra
router.post(
  "/register",
  requireDepartmentAuth,
  upload.single("profileImg"),
  registerMitra
);

// List assignable Mitras
router.get("/", requireDepartmentAuth, listDepartmentMitras);

export default router;
