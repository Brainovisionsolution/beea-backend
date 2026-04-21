// backend/middleware/validationMiddleware.js
const { body, validationResult } = require('express-validator');

const validateNomination = [
    body('fullname')
        .trim()
        .notEmpty().withMessage('Full name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Full name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Full name can only contain letters and spaces'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('mobile')
        .trim()
        .notEmpty().withMessage('Mobile number is required')
        .isLength({ min: 10, max: 15 }).withMessage('Mobile number must be between 10 and 15 digits')
        .matches(/^[0-9]+$/).withMessage('Mobile number can only contain digits'),
    
    body('age')
        .notEmpty().withMessage('Age is required')
        .isInt({ min: 18, max: 100 }).withMessage('Age must be between 18 and 100'),
    
    body('gender')
        .notEmpty().withMessage('Gender is required')
        .isIn(['Male', 'Female', 'Other']).withMessage('Invalid gender selection'),
    
    body('college_university')
        .trim()
        .notEmpty().withMessage('College/University name is required')
        .isLength({ min: 2, max: 200 }).withMessage('College name must be between 2 and 200 characters'),
    
    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ min: 5, max: 500 }).withMessage('Address must be between 5 and 500 characters'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation failed', details: errors.array() });
        }
        next();
    }
];

const validateOTPRequest = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation failed', details: errors.array() });
        }
        next();
    }
];

const validateOTPVerification = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email address')
        .normalizeEmail(),
    
    body('otp')
        .trim()
        .notEmpty().withMessage('OTP is required')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
        .matches(/^[0-9]+$/).withMessage('OTP can only contain digits'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: 'Validation failed', details: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateNomination,
    validateOTPRequest,
    validateOTPVerification
};