const db = require('../config/db');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            nominationId: user.nomination_id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE }
    );
};

// Email transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};



// SEND LOGIN OTP
exports.sendLoginOTP = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // check if email exists in nominations
        const [nominations] = await db.query(
            "SELECT * FROM nominations WHERE email = ?",
            [email]
        );

        if (nominations.length === 0) {
            return res.status(404).json({
                message: "This email is not registered for nomination"
            });
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // store OTP
        await db.query(
            "INSERT INTO email_login_otp (email, otp, expires_at) VALUES (?, ?, ?)",
            [email, otp, expiresAt]
        );

        // send email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "BEE Awards Login OTP",
            html: `
                <div style="font-family: Arial; padding:20px;">
                    <h2>BEE Awards Dashboard Login</h2>
                    <p>Your One Time Password (OTP) is:</p>
                    <h1 style="color:#D4AF37;">${otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                </div>
            `
        });

        res.json({
            success: true,
            message: "OTP sent to email"
        });

    } catch (error) {
        console.error("Send OTP error:", error);
        res.status(500).json({
            message: "Failed to send OTP"
        });
    }
};



// VERIFY LOGIN OTP
exports.verifyLoginOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        const [records] = await db.query(
            `SELECT * FROM email_login_otp 
             WHERE email=? AND otp=? AND expires_at > NOW() AND is_used = FALSE`,
            [email, otp]
        );

        if (records.length === 0) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        // mark OTP used
        await db.query(
            "UPDATE email_login_otp SET is_used = TRUE WHERE id = ?",
            [records[0].id]
        );

        // get user
        const [users] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        const token = generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                nominationId: user.nomination_id
            }
        });

    } catch (error) {
        console.error("Verify OTP error:", error);
        res.status(500).json({
            message: "OTP verification failed"
        });
    }
};



// LOGOUT
exports.logout = (req, res) => {

    res.clearCookie('token');

    res.json({
        success: true,
        message: "Logged out successfully"
    });

};



// GET CURRENT USER
exports.getCurrentUser = async (req, res) => {

    try {

        const [users] = await db.query(
            "SELECT id,email,role,nomination_id FROM users WHERE id=?",
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const user = users[0];

        const [nominations] = await db.query(
            "SELECT * FROM nominations WHERE nomination_id=?",
            [user.nomination_id]
        );

        res.json({
            success: true,
            data: {
                user,
                nomination: nominations[0] || null
            }
        });

    } catch (error) {

        console.error("Fetch user error:", error);

        res.status(500).json({
            message: "Failed to fetch user"
        });

    }

};