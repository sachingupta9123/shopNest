const express = require('express');

const router = express.Router();

const {
  registerUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  loginUser,
  getUsers,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');


// Public Routes

router.post('/register', registerUser);

router.post('/verify-otp', verifyOTP);

router.post('/resend-otp', resendOTP);

router.post('/forgot-password', forgotPassword);

router.post('/reset-password', resetPassword);

router.post('/login', loginUser);


// Admin Routes

router.get(
  '/users',
  protect,
  admin,
  getUsers
);


module.exports = router;