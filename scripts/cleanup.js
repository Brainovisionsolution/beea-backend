// backend/scripts/cleanup.js
const db = require('../config/database');

async function cleanupExpiredData() {
    try {
        const [otpResult] = await db.query("DELETE FROM user_sessions WHERE otp_expiry < NOW()");
        console.log(`Cleaned up ${otpResult.affectedRows} expired OTPs`);
        
        const [verifyResult] = await db.query("DELETE FROM verification_requests WHERE request_time < DATE_SUB(NOW(), INTERVAL 7 DAY)");
        console.log(`Cleaned up ${verifyResult.affectedRows} old verification requests`);
        
        const [nomResult] = await db.query("DELETE FROM nominations WHERE is_verified = false AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)");
        console.log(`Cleaned up ${nomResult.affectedRows} unverified nominations`);
        
        const [logResult] = await db.query("DELETE FROM login_logs WHERE login_time < DATE_SUB(NOW(), INTERVAL 30 DAY)");
        console.log(`Cleaned up ${logResult.affectedRows} old login logs`);
        
    } catch (error) {
        console.error('Cleanup error:', error);
    } finally {
        process.exit(0);
    }
}

cleanupExpiredData();