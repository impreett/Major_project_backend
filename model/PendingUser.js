const mongoose = require("mongoose");

const PendingUserSchema = new mongoose.Schema(
  {
    full_name: String,
    email: String,
    phone_number: Number,
    password: String,
    otp: String,
    otpExpires: Date,
  },
  {
    collection: "PendingUsers",
  }
);

module.exports = mongoose.model("PendingUser", PendingUserSchema);
