const User = require("../model/Users");
const PendingUser = require("../model/PendingUser");
const sendEmail = require("../utils/sendEmail");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const {
      full_name,
      fullname,
      phone_number,
      connectnumber,
      email,
      password,
    } = req.body;

    const resolvedName = full_name ?? fullname;
    const resolvedPhone = phone_number ?? connectnumber;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const pending = await PendingUser.findOne({ email });
    if (pending) {
      if (resolvedName) {
        pending.full_name = resolvedName;
      }
      if (resolvedPhone) {
        pending.phone_number = resolvedPhone;
      }
      if (password) {
        pending.password = await bcrypt.hash(password, 10);
      }
      pending.otp = otp;
      pending.otpExpires = Date.now() + 5 * 60 * 1000;

      await pending.save();
      await sendEmail(email, otp);

      return res.status(200).json({
        message: "OTP resent. Please verify.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newPendingUser = new PendingUser({
      full_name: resolvedName,
      email,
      phone_number: resolvedPhone,
      password: hashedPassword,
      otp,
      otpExpires: Date.now() + 5 * 60 * 1000,
    });

    await newPendingUser.save();
    await sendEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to email. Please verify.",
    });
  } catch (error) {
    console.error("registerUser error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const pending = await PendingUser.findOne({ email });

    if (!pending) {
      return res.status(400).json({ message: "User not found or already verified" });
    }

    if (pending.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (pending.otpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      await PendingUser.deleteOne({ _id: pending._id });
      return res.status(400).json({ message: "Email already exists" });
    }

    const newUser = new User({
      full_name: pending.full_name,
      email: pending.email,
      phone_number: pending.phone_number,
      password: pending.password,
    });

    await newUser.save();
    await PendingUser.deleteOne({ _id: pending._id });

    res.status(200).json({
      message: "Email verified successfully",
    });
  } catch (error) {
    console.error("verifyOtp error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

// RESEND OTP
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const pending = await PendingUser.findOne({ email });
    if (!pending) {
      return res.status(400).json({ message: "User not found or already verified" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pending.otp = otp;
    pending.otpExpires = Date.now() + 5 * 60 * 1000;

    await pending.save();
    await sendEmail(email, otp);

    res.status(200).json({
      message: "OTP resent. Please verify.",
    });
  } catch (error) {
    console.error("resendOtp error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};
