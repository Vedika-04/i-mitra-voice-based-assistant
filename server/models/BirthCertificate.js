import mongoose from "mongoose";

const birthCertificateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    fatherName: { type: String, required: true },
    motherName: { type: String, required: true },
    placeOfBirth: { type: String, required: true },
    fatherAadhar: { type: String, required: true }, // file path
    motherAadhar: { type: String, required: true }, // file path
  },
  { timestamps: true }
);

const BirthCertificate = mongoose.model(
  "BirthCertificate",
  birthCertificateSchema
);

export default BirthCertificate;
