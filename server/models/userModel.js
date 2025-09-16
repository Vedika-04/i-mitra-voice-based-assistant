import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Fixed zone list enum
const ZONES_LIST = [
  "Dr. Hedgewar (Kila Maidan) Zone",
  "Lal Bahadur Shastri (Raj Mohalla) Zone",
  "Shaheed Bhagat Singh (Nagar Nigam) Zone",
  "Maharana Pratap (Sangam Nagar) Zone",
  "Chandragupta Maurya (Sukhaliya) Zone",
  "Subhash Chandra Bose (Subhash Nagar) Zone",
  "Atal Bihari Vajpayee (Scheme No. 54) Zone",
  "Chandrashekhar Azad (Vijay Nagar) Zone",
  "Dr. Bhimrao Ambedkar (Pancham ki fel) Zone",
  "Dr. Shyamaprasad Mukherjee (Saket Nagar) Zone",
  "Rajmata Scindia (Stadium) Zone",
  "Harsiddhi Zone",
  "Pt. Deendayal Upadhyay (Bilawali) Zone",
  "Rajendra Dharkar (Hawa Bungalow) Zone",
  "Laxman Singh Gaud (David Nagar) Zone",
  "Kushabhau Thackeray (Aerodrome Road) Zone",
  "Mahatma Gandhi (Narwal) Zone",
  "Chhatrapati Shivaji (Krishi Vihar) Zone",
  "Sardar Vallabhbhai Patel (Scheme No. 94) Zone",
  "Rajmata Jeejabai Zone",
  "Swatantra Veer Vinayak Damodar Sawarkar (Pragati Nagar Zone)",
  "Gen. Harisingh Nalwa (Bombay Hospital Water tank zone)",
];

const userSchema = new mongoose.Schema({
  // Required basic info
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    lowercase: true,
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    index: true,
  },

  // Required profile image
  profileimg: { type: String, required: [true, "Profile image is required"] },

  // Required address & zone
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  zone: {
    type: String,
    required: [true, "Zone is required"],
    enum: ZONES_LIST,
  },

  // Required password
  password: {
    type: String,
    required: [true, "Password is required"],
    minLength: [8, "Password must have at least 8 characters."],
    maxLength: [32, "Password cannot have more than 32 characters."],
    select: false,
  },

  // Default role
  role: { type: String, default: "citizen", enum: ["citizen"], required: true },

  // Optional fields
  age: { type: Number, min: 13, max: 120 },
  aadhaarNo: {
    type: String,
    match: [/^[0-9]{12}$/, "Invalid Aadhaar number"],
    sparse: true,
  },

  // Verification & reset
  accountVerified: { type: Boolean, default: false },
  verificationCode: Number,
  verificationCodeExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// OTP Generator
userSchema.methods.generateVerificationCode = function () {
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  const code = parseInt(firstDigit + remainingDigits);
  this.verificationCode = code;
  this.verificationCodeExpire = Date.now() + 10 * 60 * 1000;
  return code;
};

// JWT generator
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_EXPIRE,
    }
  );
};

// Reset password token generator
userSchema.methods.generateResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);
