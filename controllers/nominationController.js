const db = require('../config/db');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
const crypto = require('crypto');
const { validationResult } = require("express-validator");

// Email configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// SMS configuration (Twilio)
const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Generate unique nomination ID
const generateNominationId = async () => {
    const prefix = 'NOM-BEEA26';
    const [rows] = await db.query('SELECT COUNT(*) as count FROM nominations');
    const count = rows[0].count + 1;
    const sequence = String(count).padStart(4, '0');
    return `${prefix}-${sequence}`;
};

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send confirmation email after successful verification
const sendNominationConfirmationEmail = async (email, nominationId, fullName) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'BEE Awards 2026 - Nomination Confirmed',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #D4AF37; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #0B1A2F; font-size: 28px; margin-bottom: 5px;">Bharath Education Excellence Awards</h1>
                    <p style="color: #D4AF37; font-size: 18px;">2026 Edition</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #0B1A2F 0%, #132C42 100%); color: #F5E6C4; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
                    <h2 style="color: #D4AF37; margin-bottom: 20px;">Nomination Confirmed!</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                        Dear ${fullName},<br>
                        Thank you for verifying your email. Your nomination for the prestigious Bharath Education Excellence Awards 2026 has been successfully confirmed.
                    </p>
                    <div style="background: rgba(212, 175, 55, 0.2); padding: 20px; border-radius: 5px; margin: 20px 0;">
                        <p style="margin: 5px 0;"><strong>Your Nomination ID:</strong> <span style="color: #D4AF37; font-size: 20px;">${nominationId}</span></p>
                        <p style="margin: 5px 0;"><strong>Status:</strong> <span style="color: #D4AF37;">Under Review</span></p>
                    </div>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="color: #0B1A2F;">Next Steps:</h3>
                    <ul style="list-style-type: none; padding: 0;">
                        <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                            <span style="color: #D4AF37; position: absolute; left: 0;">✓</span>
                            Our team will review your nomination within 3-5 working days
                        </li>
                        <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                            <span style="color: #D4AF37; position: absolute; left: 0;">✓</span>
                            You'll receive an update via email and SMS
                        </li>
                        <li style="margin-bottom: 15px; padding-left: 25px; position: relative;">
                            <span style="color: #D4AF37; position: absolute; left: 0;">✓</span>
                            Shortlisted nominees will be contacted for further process
                        </li>
                    </ul>
                </div>

                <div style="border-top: 2px solid #D4AF37; padding-top: 20px; text-align: center; color: #666;">
                    <p>For any queries, contact us at:</p>
                    <p style="color: #0B1A2F;">
                        📧 support@beeawards.com | 📞 +91 9876543210
                    </p>
                    <p style="font-size: 12px; margin-top: 20px;">
                        This is an automated message, please do not reply to this email.
                    </p>
                </div>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

// Send SMS notification
const sendNominationSMS = async (mobile, nominationId, fullName) => {
    try {
        const message = await twilioClient.messages.create({
            body: `Dear ${fullName}, your nomination for BEE Awards 2026 is confirmed! Nomination ID: ${nominationId}. We'll keep you updated on the status. - BEEA Team`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobile
        });
        console.log('SMS sent:', message.sid);
    } catch (error) {
        console.error('SMS sending failed:', error);
    }
};

// Submit nomination - Step 1: Save in verification table
exports.submitNomination = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            fullName, email, mobile, gender, college,
            designation, experienceYears, category, achievements, address
        } = req.body;

        // First, clean up expired verification records
        await db.query(
            "DELETE FROM nomination_verification WHERE expires_at < NOW()"
        );

        // Check if email already exists in nominations
        const [existing] = await db.query(
            'SELECT id FROM nominations WHERE email = ? OR mobile = ?',
            [email, mobile]
        );

        if (existing.length > 0) {
            return res.status(400).json({ 
                message: 'A nomination with this email or mobile number already exists' 
            });
        }

        // Check if email already has pending verification
        const [pendingVerification] = await db.query(
            'SELECT id FROM nomination_verification WHERE email = ? AND expires_at > NOW()',
            [email]
        );

        if (pendingVerification.length > 0) {
            return res.status(400).json({ 
                message: 'A verification email has already been sent. Please check your inbox or wait for it to expire before trying again.' 
            });
        }

        // Generate verification token
        const token = crypto.randomBytes(32).toString("hex");

        // Handle photo upload
        let photoPath = null;
        if (req.file) {
            photoPath = req.file.path;
        }

        // Save form temporarily in verification table
        await db.query(
            `INSERT INTO nomination_verification (email, token, data, expires_at)
             VALUES (?, ?, ?, ?)`,
            [
                email,
                token,
                JSON.stringify({
                    fullName,
                    email,
                    mobile,
                    gender,
                    college,
                    designation,
                    experienceYears,
                    category,
                    achievements,
                    address,
                    photoPath
                }),
                new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
            ]
        );

        // Send Verification Email - FIXED: Using BACKEND_URL from env
        const verifyLink = `${process.env.BACKEND_URL}/api/nominations/verify/${token}`;

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Your Nomination - BEE Awards 2026",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #D4AF37; border-radius: 10px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #0B1A2F; font-size: 28px; margin-bottom: 5px;">Bharath Education Excellence Awards</h1>
                        <p style="color: #D4AF37; font-size: 18px;">2026 Edition</p>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #0B1A2F 0%, #132C42 100%); color: #F5E6C4; padding: 30px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
                        <h2 style="color: #D4AF37; margin-bottom: 20px;">Verify Your Email Address</h2>
                        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                            Dear ${fullName},<br>
                            Thank you for submitting your nomination for the BEE Awards 2026.<br>
                            Please click the button below to verify your email address and complete your nomination.
                        </p>
                        
                        <a href="${verifyLink}" style="background:#D4AF37; padding: 15px 30px; color:#0B1A2F; text-decoration:none; border-radius:5px; font-weight:bold; display:inline-block; margin:20px 0;">
                            ✓ Verify Nomination
                        </a>
                        
                        <p style="font-size: 14px; margin-top: 30px; color: #F5E6C4;">
                            This link will expire in 24 hours.<br>
                            If you didn't submit this nomination, please ignore this email.
                        </p>
                    </div>

                    <div style="border-top: 2px solid #D4AF37; padding-top: 20px; text-align: center; color: #666;">
                        <p>For any queries, contact us at:</p>
                        <p style="color: #0B1A2F;">
                            📧 support@beeawards.com | 📞 +91 9876543210
                        </p>
                    </div>
                </div>
            `
        });

        res.status(200).json({
            success: true,
            message: "Verification email sent. Please verify your email to complete nomination.",
            data: {
                email,
                fullName,
                expiresIn: '24 hours'
            }
        });

    } catch (error) {
        console.error('Nomination submission error:', error);
        res.status(500).json({ message: 'Failed to submit nomination', error: error.message });
    }
};

// Verify nomination - Step 2: Process verification and move to nominations table
exports.verifyNomination = async (req, res) => {
    try {
        const { token } = req.params;

        // First, clean up expired verification records
        await db.query(
            "DELETE FROM nomination_verification WHERE expires_at < NOW()"
        );

        // SAFETY FIX: Delete this specific token if it's expired
        await db.query(
            "DELETE FROM nomination_verification WHERE token = ? AND expires_at < NOW()",
            [token]
        );

        // Find the verification record - using token index for faster search
        const [verificationRecords] = await db.query(
            'SELECT * FROM nomination_verification WHERE token = ? AND expires_at > NOW()',
            [token]
        );

        if (verificationRecords.length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Invalid or expired verification link. Please submit your nomination again.' 
            });
        }

        const verification = verificationRecords[0];
        const nominationData = JSON.parse(verification.data);

        // Double-check if nomination already exists (prevent duplicate processing)
        const [existing] = await db.query(
            'SELECT id FROM nominations WHERE email = ? OR mobile = ?',
            [nominationData.email, nominationData.mobile]
        );

        if (existing.length > 0) {
            // Delete the verification record since it's no longer needed - FIXED: delete by token
            await db.query('DELETE FROM nomination_verification WHERE token = ?', [token]);
            
            return res.status(400).json({ 
                success: false,
                message: 'A nomination with this email or mobile number already exists.' 
            });
        }

        // Generate nomination ID
        const nominationId = await generateNominationId();

        // Insert into nominations table
        const [result] = await db.query(
            `INSERT INTO nominations 
            (nomination_id, full_name, email, mobile, gender, college, 
             designation, experience_years, category, photo_path, achievements, address, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
            [
                nominationId, 
                nominationData.fullName, 
                nominationData.email, 
                nominationData.mobile, 
                nominationData.gender, 
                nominationData.college,
                nominationData.designation, 
                nominationData.experienceYears, 
                nominationData.category, 
                nominationData.photoPath, 
                nominationData.achievements, 
                nominationData.address
            ]
        );

        // Create user account with nomination ID as password
        const hashedPassword = await bcrypt.hash(nominationId, 10);
        await db.query(
            'INSERT INTO users (nomination_id, email, password, role) VALUES (?, ?, ?, "nominator")',
            [nominationId, nominationData.email, hashedPassword]
        );

        // Delete the verification record - FIXED: delete by token (safer)
        await db.query('DELETE FROM nomination_verification WHERE token = ?', [token]);

        // Send confirmation email
        await sendNominationConfirmationEmail(nominationData.email, nominationId, nominationData.fullName);

        // Send SMS
        await sendNominationSMS(nominationData.mobile, nominationId, nominationData.fullName);

        // Redirect to success page or return JSON based on request type
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.json({
                success: true,
                message: 'Nomination verified and confirmed successfully',
                data: {
                    nominationId,
                    fullName: nominationData.fullName,
                    email: nominationData.email,
                    status: 'pending',
                    loginCredentials: {
                        email: nominationData.email,
                        password: nominationId,
                        message: 'Please save these credentials to login to your dashboard'
                    }
                }
            });
        } else {
            // Redirect to frontend success page
            res.redirect(`${process.env.FRONTEND_URL}/nomination-success?nominationId=${nominationId}`);
        }

    } catch (error) {
        console.error('Nomination verification error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to verify nomination', 
            error: error.message 
        });
    }
};

// Get my nomination (authenticated)
exports.getMyNomination = async (req, res) => {
    try {
        const [nominations] = await db.query(
            `SELECT * FROM nominations WHERE nomination_id = ?`,
            [req.user.nominationId]
        );

        if (nominations.length === 0) {
            return res.status(404).json({ message: 'Nomination not found' });
        }

        res.json({
            success: true,
            data: nominations[0]
        });

    } catch (error) {
        console.error('Error fetching nomination:', error);
        res.status(500).json({ message: 'Failed to fetch nomination' });
    }
};

// Verify mobile with OTP
exports.verifyMobile = async (req, res) => {
    try {
        const { mobile, otp } = req.body;

        const [otpRecords] = await db.query(
            'SELECT * FROM otp_verification WHERE mobile = ? AND otp = ? AND expires_at > NOW() AND is_verified = FALSE',
            [mobile, otp]
        );

        if (otpRecords.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Mark OTP as verified
        await db.query(
            'UPDATE otp_verification SET is_verified = TRUE WHERE id = ?',
            [otpRecords[0].id]
        );

        res.json({ success: true, message: 'Mobile verified successfully' });

    } catch (error) {
        console.error('Mobile verification error:', error);
        res.status(500).json({ message: 'Verification failed' });
    }
};

// Resend OTP
exports.resendOTP = async (req, res) => {
    try {
        const { mobile } = req.body;
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete old OTPs
        await db.query('DELETE FROM otp_verification WHERE mobile = ?', [mobile]);

        // Insert new OTP
        await db.query(
            'INSERT INTO otp_verification (mobile, otp, expires_at) VALUES (?, ?, ?)',
            [mobile, otp, expiresAt]
        );

        // Send SMS with new OTP
        await twilioClient.messages.create({
            body: `Your BEE Awards verification OTP is: ${otp}. Valid for 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: mobile
        });

        res.json({ success: true, message: 'OTP resent successfully' });

    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'Failed to resend OTP' });
    }
};

// Get nomination status
exports.getNominationStatus = async (req, res) => {
    try {
        const { nominationId } = req.params;

        const [nominations] = await db.query(
            'SELECT nomination_id, full_name, status, created_at, updated_at FROM nominations WHERE nomination_id = ?',
            [nominationId]
        );

        if (nominations.length === 0) {
            return res.status(404).json({ message: 'Nomination not found' });
        }

        res.json({
            success: true,
            data: nominations[0]
        });

    } catch (error) {
        console.error('Error fetching status:', error);
        res.status(500).json({ message: 'Failed to fetch status' });
    }
};

// Keep verifyEmail as alias for backward compatibility if needed
exports.verifyEmail = exports.verifyNomination;