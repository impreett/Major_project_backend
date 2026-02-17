const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.registerUser);
router.post("/verifyOtp", authController.verifyOtp);
router.post("/resendOtp", authController.resendOtp);

module.exports = router;
