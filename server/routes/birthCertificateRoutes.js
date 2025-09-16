import express from "express";
import multer from "multer";
import {
  createBirthCertificate,
  getAllApplications,
} from "../controllers/birthCertificateController.js";

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // uploads folder me save hoga
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post(
  "/birth-certificate",
  upload.fields([
    { name: "fatherAadhar", maxCount: 1 },
    { name: "motherAadhar", maxCount: 1 },
  ]),
  createBirthCertificate
);

router.get("/", getAllApplications);

export default router;
