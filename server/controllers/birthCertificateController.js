import BirthCertificate from "../models/BirthCertificate.js";

// @desc Create new Birth Certificate Application
// @route POST /api/birth-certificates
// @access Public
export const createBirthCertificate = async (req, res) => {
  try {
    const { name, dob, fatherName, motherName, placeOfBirth } = req.body;

    if (!req.files || !req.files.fatherAadhar || !req.files.motherAadhar) {
      return res.status(400).json({ message: "Aadhaar files are required" });
    }

    const fatherAadharPath = req.files.fatherAadhar[0].path;
    const motherAadharPath = req.files.motherAadhar[0].path;

    const application = new BirthCertificate({
      name,
      dob,
      fatherName,
      motherName,
      placeOfBirth,
      fatherAadhar: fatherAadharPath,
      motherAadhar: motherAadharPath,
    });

    const savedApp = await application.save();
    res.status(201).json(savedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get all Applications
// @route GET /api/birth-certificates
export const getAllApplications = async (req, res) => {
  try {
    const applications = await BirthCertificate.find();
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
