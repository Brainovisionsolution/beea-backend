const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/send-login-otp", authController.sendLoginOTP);
router.post("/verify-login-otp", authController.verifyLoginOTP);
router.post("/logout", authController.logout);
router.get("/me", authController.getCurrentUser);

module.exports = router;