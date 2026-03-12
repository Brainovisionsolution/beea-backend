const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

// All routes require authentication
router.use(authMiddleware);

// User dashboard
router.get('/dashboard', userController.getDashboard);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.post('/change-password', userController.changePassword);
router.get('/nomination-details', userController.getNominationDetails);
router.post('/withdraw-nomination', userController.withdrawNomination);

module.exports = router;