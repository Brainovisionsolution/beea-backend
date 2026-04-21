import { db } from "../config/db.js";
import { generateToken, verifyToken } from "../utils/token.js";
import { sendEmail } from "../utils/email.js";
import { generateNominationId } from "../utils/generateId.js";

export const submitNomination = (req, res) => {
  try {
    const data = req.body;
    const email = data.email;

    // 🔍 CHECK IN FINAL TABLE
    db.query(
      "SELECT * FROM nominations WHERE email=?",
      [email],
      (err, existingUser) => {
        if (err) return res.status(500).json(err);

        if (existingUser.length > 0) {
          return res.json({ message: "Email already registered" });
        }

        // 🔍 CHECK IN PENDING TABLE
        db.query(
          "SELECT * FROM pending_nominations WHERE email=?",
          [email],
          (err, pendingUser) => {
            if (err) return res.status(500).json(err);

            if (pendingUser.length > 0) {
              return res.json({ message: "Verification already sent. Check your email." });
            }

            // ✅ CREATE TOKEN
            const token = generateToken(email);

            db.query(
              "INSERT INTO pending_nominations (email, data, token) VALUES (?, ?, ?)",
              [email, JSON.stringify(data), token],
              async (err) => {
                if (err) return res.status(500).json(err);

                const link = `${process.env.FRONTEND_URL}/verify?token=${token}`;

                try {
                  await sendEmail(email, "Verify Email", `Click: ${link}`);
                } catch (e) {
                  console.log("Email failed");
                }

                res.json({ message: "Verification email sent" });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// VERIFY EMAIL
export const verifyEmailController = async (req, res) => {
  try {
    const { token } = req.query;
    const decoded = verifyToken(token);

    db.query(
      "SELECT * FROM pending_nominations WHERE email=?",
      [decoded.email],
      async (err, result) => {
        if (err || result.length === 0)
          return res.status(400).json({ message: "Invalid" });

        const data = JSON.parse(result[0].data);

        const nominationId = await generateNominationId(db);

        db.query(
          "INSERT INTO nominations SET ?",
          { ...data, nomination_id: nominationId, status: "Pending" },
          () => {
            db.query(
              "DELETE FROM pending_nominations WHERE email=?",
              [decoded.email]
            );
          }
        );

        res.json({ message: "Email verified successfully" });
      }
    );
  } catch (error) {
    res.status(400).json({ message: "Token invalid" });
  }
};