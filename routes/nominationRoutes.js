const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { body } = require('express-validator');
const nominationController = require('../controllers/nominationController');
const authMiddleware = require('../middleware/authMiddleware');


// -----------------------------
// Multer configuration
// -----------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;

    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Only images are allowed'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});


// -----------------------------
// Validation Rules
// -----------------------------
const nominationValidation = [
    body('fullName')
        .notEmpty()
        .withMessage('Full name is required'),

    body('email')
        .isEmail()
        .withMessage('Valid email is required'),

    body('mobile')
        .isMobilePhone()
        .withMessage('Valid mobile number is required'),

    body('gender')
        .isIn(['male', 'female', 'other'])
        .withMessage('Valid gender is required'),

    body('college')
        .notEmpty()
        .withMessage('College/Institution name is required'),

    body('designation')
        .notEmpty()
        .withMessage('Designation is required'),

    body('experienceYears')
        .isInt({ min: 0 })
        .withMessage('Valid experience years required'),

    body('category')
        .notEmpty()
        .withMessage('Category is required')
];


// -----------------------------
// Routes
// -----------------------------

// Submit nomination
router.post(
    '/submit',
    upload.single('photo'),
    nominationValidation,
    nominationController.submitNomination
);

// ✅ Email verification (FIXED ROUTE)
router.get(
    '/verify/:token',
    nominationController.verifyNomination
);

// Mobile OTP verification
router.post(
    '/verify-mobile',
    nominationController.verifyMobile
);

// Resend OTP
router.post(
    '/resend-otp',
    nominationController.resendOTP
);

// Get logged-in user's nomination
router.get(
    '/my-nomination',
    authMiddleware,
    nominationController.getMyNomination
);

// Check nomination status
router.get(
    '/status/:nominationId',
    nominationController.getNominationStatus
);

module.exports = router;