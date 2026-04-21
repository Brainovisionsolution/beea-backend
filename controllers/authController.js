import { db } from "../config/db.js";
import { generateOTP } from "../utils/otp.js";
import { sendEmail } from "../utils/email.js";

// SEND OTP
export const sendOTPController = (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  db.query(
    "INSERT INTO login_otp (email, otp) VALUES (?, ?)",
    [email, otp],
    async () => {
      await sendEmail(email, "Your OTP", `OTP: ${otp}`);
      res.json({ message: "OTP sent" });
    }
  );
};

// VERIFY OTP
export const verifyOTPController = (req, res) => {
  const { email, otp } = req.body;

  db.query(
    "SELECT * FROM login_otp WHERE email=? AND otp=?",
    [email, otp],
    (err, result) => {
      if (result.length > 0) {
        res.json({ success: true });
      } else {
        res.json({ success: false });
      }
    }
  );
};