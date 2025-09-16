import ErrorHandler from "../middlewares/error.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../utils/sendToken.js";
import crypto from "crypto";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Twilio client
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

// ✅ Email domain regex (allowed providers)
const emailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/;
// ✅ Indian phone regex (+91XXXXXXXXXX)
const phoneRegex = /^\+91\d{10}$/;

// Temporary in-memory store for pending verifications
let pendingVerifications = {};

// ================= REGISTER ===================
export const register = catchAsyncError(async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      address,
      zone,
      verificationMethod,
      age,
      aadhaarNo,
    } = req.body;

    // Validate required fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !password ||
      !address ||
      !zone ||
      !verificationMethod
    ) {
      return next(
        new ErrorHandler("All required fields must be provided.", 400)
      );
    }

    // Validate email & phone formats
    if (!emailRegex.test(email)) {
      return next(
        new ErrorHandler("Invalid email format or domain not allowed.", 400)
      );
    }
    if (!phoneRegex.test(phone)) {
      return next(
        new ErrorHandler(
          "Invalid phone number. Must be in +91XXXXXXXXXX format.",
          400
        )
      );
    }

    // Check for duplicate verified user
    const existingUser = await User.findOne({
      $or: [
        { email, accountVerified: true },
        { phone, accountVerified: true },
      ],
    });
    if (existingUser) {
      return next(new ErrorHandler("Phone or Email is already used.", 400));
    }

    // Check profile image file
    if (!req.file || !req.file.path) {
      return next(new ErrorHandler("Profile image is required.", 400));
    }

    // Upload to Cloudinary
    const cloudRes = await uploadOnCloudinary(req.file.path);
    if (!cloudRes || !cloudRes.secure_url) {
      return next(new ErrorHandler("Failed to upload profile image.", 500));
    }
    const profileimg = cloudRes.secure_url;

    // OTP generation (5 digits)
    const verificationCode = Math.floor(10000 + Math.random() * 90000);
    const verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Save info to pending verifications (temporarily)
    pendingVerifications[email] = {
      fullName,
      email,
      phone,
      password,
      profileimg,
      address,
      zone,
      verificationCode,
      verificationCodeExpire,
      verificationMethod,
      age,
      aadhaarNo,
    };

    // Send OTP
    await sendVerificationCode(
      verificationMethod,
      verificationCode,
      fullName,
      email,
      phone,
      res
    );
  } catch (error) {
    next(error);
  }
});

// ================= SEND OTP HELPER ===================
async function sendVerificationCode(
  verificationMethod,
  verificationCode,
  name,
  email,
  phone,
  res
) {
  try {
    if (verificationMethod === "email") {
      const message = generateEmailTemplate(verificationCode);
      sendEmail({
        email,
        subject: "Your Verification Code",
        message,
      });
      res.status(200).json({
        success: true,
        message: `Verification email successfully sent to ${name}`,
      });
    } else if (verificationMethod === "phone") {
      const spacedCode = verificationCode.toString().split("").join(" ");
      await client.messages.create({
        body: `Hello ${name}, welcome to i-Mitra. Your OTP is ${spacedCode}. Please do not share.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      res.status(200).json({
        success: true,
        message: `OTP sent to phone.`,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid verification method.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Verification code failed to send.",
    });
  }
}
// ================= SEND OTP VIA CALL HELPER ===================
async function sendVerificationCall(
  verificationCode,
  name,
  phone,
  res
) {
  try {
    // OTP को थोड़ा clear बोलने के लिए spaces देंगे
    const spacedCode = verificationCode.toString().split("").join(" ");

    const callMessage = `Hello ${name}, welcome to i-Mitra. 
    Your one time password is ${spacedCode}. 
    Please do not share this code with anyone.`;

    await client.calls.create({
      twiml: `<Response><Say voice="alice" language="en-US">${callMessage}</Say></Response>`,
      to: phone,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

  res.status(200).json({
      success: true,
      message: `OTP call initiated to ${name}.`,
    });
  } catch (error) {
    console.error("Twilio Call error:", error);
    res.status(500).json({
      success: false,
      message: "Verification call failed to initiate.",
    });
  }
}

// ================= OTP EMAIL TEMPLATE ===================
function generateEmailTemplate(verificationCode) {
  return `
    <div style="font-family: Arial; max-width: 600px; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
      <h2 style="color: #4CAF50;">Verification Code</h2>
      <p>Your verification code is:</p>
      <div style="font-size: 24px; font-weight: bold; color: #4CAF50;">
        ${verificationCode}
      </div>
      <p>This code will expire in 10 minutes.</p>
    </div>
  `;
}

// ================= VERIFY OTP ===================
export const verifyOTP = catchAsyncError(async (req, res, next) => {
  const { email, otp } = req.body;

  if (!pendingVerifications[email]) {
    return next(new ErrorHandler("No pending verification found.", 400));
  }

  const {
    fullName,
    phone,
    password,
    profileimg,
    address,
    zone,
    verificationCode,
    verificationCodeExpire,
    age,
    aadhaarNo,
  } = pendingVerifications[email];

  if (Number(otp) !== verificationCode) {
    return next(new ErrorHandler("Invalid OTP.", 400));
  }

  if (Date.now() > verificationCodeExpire) {
    delete pendingVerifications[email];
    return next(new ErrorHandler("OTP expired.", 400));
  }

  // Create verified user in DB (role defaults to citizen)
  const user = await User.create({
    fullName,
    email,
    phone,
    password,
    profileimg,
    address,
    zone,
    accountVerified: true,
    age,
    aadhaarNo,
  });

  delete pendingVerifications[email];

  sendToken(user, 200, "Account Verified.", res);
});

// ================= LOGIN ===================
export const login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Email and password are required.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select(
    "+password"
  );
  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 400));
  }
  sendToken(user, 200, "User logged in successfully.", res);
});

// ================= LOGOUT ===================
export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logged out successfully.",
    });
});

// ================= GET USER ===================
export const getUser = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ================= FORGOT PASSWORD ===================
export const forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const resetToken = user.generateResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = `Your Reset Password Token is:\n\n${resetPasswordUrl}`;

  try {
    sendEmail({
      email: user.email,
      subject: "Reset Password",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler("Cannot send reset password token.", 500));
  }
});

// ================= RESET PASSWORD ===================
export const resetPassword = catchAsyncError(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password token is invalid or has expired.", 400)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, "Password reset successfully.", res);
});
