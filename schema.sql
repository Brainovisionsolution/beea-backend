-- database/schema.sql
CREATE DATABASE IF NOT EXISTS nomination_system;
USE nomination_system;

-- Counter table for sequential ID generation
CREATE TABLE IF NOT EXISTS id_counter (
    id INT PRIMARY KEY DEFAULT 1,
    last_number INT DEFAULT 0,
    updated_at TIMESTAMP NULL
);

-- Ensure counter row exists
INSERT INTO id_counter (id, last_number) VALUES (1, 0) 
ON DUPLICATE KEY UPDATE id = 1;

-- Main nominations table
CREATE TABLE IF NOT EXISTS nominations (
    id VARCHAR(20) PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    college_university VARCHAR(200) NOT NULL,
    designation VARCHAR(100),
    experience_years DECIMAL(3,1),
    linkedin_profile VARCHAR(255),
    address TEXT NOT NULL,
    profile_photo VARCHAR(255),
    status ENUM('pending', 'verified', 'approved', 'rejected') DEFAULT 'pending',
    verification_token VARCHAR(100),
    token_expiry DATETIME,
    is_verified BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_verification_token (verification_token),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- User sessions for OTP login
CREATE TABLE IF NOT EXISTS user_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    otp_expiry DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (email) REFERENCES nominations(email) ON DELETE CASCADE,
    INDEX idx_email (email),
    INDEX idx_otp_expiry (otp_expiry)
);

-- Resend verification requests tracking
CREATE TABLE IF NOT EXISTS verification_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    request_time DATETIME NOT NULL,
    ip_address VARCHAR(45),
    INDEX idx_email_time (email, request_time)
);

-- Login tracking for analytics
CREATE TABLE IF NOT EXISTS login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    login_time DATETIME NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_email (email),
    INDEX idx_login_time (login_time)
);