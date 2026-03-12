const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Get dashboard data
exports.getDashboard = async (req, res) => {
    try {
        // Get user's nomination details
        const [nominations] = await db.query(
            `SELECT * FROM nominations WHERE nomination_id = ?`,
            [req.user.nominationId]
        );

        const nomination = nominations[0] || null;

        // Get statistics
        const [stats] = await db.query(
            `SELECT 
                COUNT(*) as total_nominations,
                SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_count,
                SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_count
             FROM nominations`
        );

        // Get recent activities
        const [activities] = await db.query(
            `SELECT 
                'Nomination Submitted' as action,
                created_at as date
             FROM nominations 
             WHERE nomination_id = ?
             UNION ALL
             SELECT 
                'Status Updated' as action,
                updated_at as date
             FROM nominations 
             WHERE nomination_id = ? AND status != 'pending'
             ORDER BY date DESC
             LIMIT 5`,
            [req.user.nominationId, req.user.nominationId]
        );

        res.json({
            success: true,
            data: {
                nomination,
                stats: stats[0] || { total_nominations: 0, approved_count: 0, pending_count: 0 },
                activities: activities || []
            }
        });

    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: 'Failed to load dashboard' });
    }
};

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, email, role, nomination_id, created_at FROM users WHERE id = ?',
            [req.user.id]
        );

        const [nominations] = await db.query(
            'SELECT * FROM nominations WHERE nomination_id = ?',
            [req.user.nominationId]
        );

        res.json({
            success: true,
            data: {
                user: users[0],
                nomination: nominations[0] || null
            }
        });

    } catch (error) {
        console.error('Profile error:', error);
        res.status(500).json({ message: 'Failed to load profile' });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const { fullName, mobile, address } = req.body;

        // Update nomination details
        await db.query(
            `UPDATE nominations 
             SET full_name = ?, mobile = ?, address = ?
             WHERE nomination_id = ?`,
            [fullName, mobile, address, req.user.nominationId]
        );

        res.json({
            success: true,
            message: 'Profile updated successfully'
        });

    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ message: 'Failed to update profile' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get user with current password
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        const user = users[0];

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query(
            'UPDATE users SET password = ? WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
};

// Get nomination details
exports.getNominationDetails = async (req, res) => {
    try {
        const [nominations] = await db.query(
            `SELECT n.*, 
                u.email as user_email,
                u.created_at as account_created
             FROM nominations n
             LEFT JOIN users u ON n.nomination_id = u.nomination_id
             WHERE n.nomination_id = ?`,
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
        console.error('Nomination details error:', error);
        res.status(500).json({ message: 'Failed to load nomination details' });
    }
};

// Withdraw nomination
exports.withdrawNomination = async (req, res) => {
    try {
        await db.query(
            'UPDATE nominations SET status = "withdrawn" WHERE nomination_id = ?',
            [req.user.nominationId]
        );

        res.json({
            success: true,
            message: 'Nomination withdrawn successfully'
        });

    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ message: 'Failed to withdraw nomination' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                message: 'Current password and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                message: 'New password must be at least 6 characters long' 
            });
        }

        // Get user with current password
        const [users] = await db.query(
            'SELECT * FROM users WHERE id = ?',
            [req.user.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // Verify current password
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        await db.query(
            'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
            [hashedPassword, req.user.id]
        );

        // Send email notification about password change
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Password Changed - BEE Awards',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h2 style="color: #0B1A2F;">Password Changed Successfully</h2>
                        <p>Hello,</p>
                        <p>Your password for BEE Awards account has been successfully changed.</p>
                        <p>If you did not make this change, please contact us immediately at support@beeawards.com</p>
                        <br>
                        <p>Best regards,<br>BEE Awards Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Failed to send password change email:', emailError);
            // Don't block the response if email fails
        }

        res.json({
            success: true,
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Password change error:', error);
        res.status(500).json({ message: 'Failed to change password' });
    }
};

// Get nomination details
exports.getNominationDetails = async (req, res) => {
    try {
        const [nominations] = await db.query(
            `SELECT n.*, 
                u.email as user_email,
                u.created_at as account_created,
                u.updated_at as last_login
             FROM nominations n
             LEFT JOIN users u ON n.nomination_id = u.nomination_id
             WHERE n.nomination_id = ?`,
            [req.user.nominationId]
        );

        if (nominations.length === 0) {
            return res.status(404).json({ message: 'Nomination not found' });
        }

        // Get nomination timeline/status history
        const [timeline] = await db.query(
            `SELECT 
                'Nomination Submitted' as event,
                created_at as date,
                'completed' as status
             FROM nominations 
             WHERE nomination_id = ?
             UNION ALL
             SELECT 
                'Under Review' as event,
                updated_at as date,
                CASE WHEN status = 'pending' THEN 'pending' ELSE 'completed' END as status
             FROM nominations 
             WHERE nomination_id = ? AND status = 'pending'
             UNION ALL
             SELECT 
                'Application Reviewed' as event,
                updated_at as date,
                'completed' as status
             FROM nominations 
             WHERE nomination_id = ? AND status != 'pending'
             UNION ALL
             SELECT 
                'Final Decision' as event,
                updated_at as date,
                CASE WHEN status = 'approved' THEN 'completed' WHEN status = 'rejected' THEN 'rejected' ELSE 'pending' END as status
             FROM nominations 
             WHERE nomination_id = ? AND (status = 'approved' OR status = 'rejected')`,
            [req.user.nominationId, req.user.nominationId, req.user.nominationId, req.user.nominationId]
        );

        res.json({
            success: true,
            data: {
                nomination: nominations[0],
                timeline: timeline || []
            }
        });

    } catch (error) {
        console.error('Nomination details error:', error);
        res.status(500).json({ message: 'Failed to load nomination details' });
    }
};

// Withdraw nomination
exports.withdrawNomination = async (req, res) => {
    try {
        const { reason } = req.body;

        // Check if nomination can be withdrawn (only pending nominations)
        const [nominations] = await db.query(
            'SELECT status, email, full_name FROM nominations WHERE nomination_id = ?',
            [req.user.nominationId]
        );

        if (nominations.length === 0) {
            return res.status(404).json({ message: 'Nomination not found' });
        }

        const nomination = nominations[0];

        if (nomination.status !== 'pending') {
            return res.status(400).json({ 
                message: `Cannot withdraw nomination with status: ${nomination.status}` 
            });
        }

        // Update nomination status
        await db.query(
            'UPDATE nominations SET status = "withdrawn", updated_at = NOW() WHERE nomination_id = ?',
            [req.user.nominationId]
        );

        // Send confirmation email
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: nomination.email,
                subject: 'Nomination Withdrawn - BEE Awards',
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 2px solid #D4AF37; border-radius: 10px;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <h1 style="color: #0B1A2F;">Nomination Withdrawn</h1>
                        </div>
                        
                        <p>Dear ${nomination.full_name},</p>
                        
                        <p>Your nomination for the BEE Awards 2026 has been successfully withdrawn.</p>
                        
                        ${reason ? `
                        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p><strong>Reason provided:</strong></p>
                            <p>${reason}</p>
                        </div>
                        ` : ''}
                        
                        <p>If you wish to reapply, you can submit a new nomination at any time before the deadline.</p>
                        
                        <p>We hope to see you apply again in the future!</p>
                        
                        <br>
                        <p>Best regards,<br>BEE Awards Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Failed to send withdrawal email:', emailError);
        }

        res.json({
            success: true,
            message: 'Nomination withdrawn successfully'
        });

    } catch (error) {
        console.error('Withdraw error:', error);
        res.status(500).json({ message: 'Failed to withdraw nomination' });
    }
};