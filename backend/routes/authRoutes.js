// routes/authRoutes.js
const express = require('express');
const {
  signup,
  login,
  changePassword,
  requestPasswordReset,
  resetPassword,
  updateProfile,
  verifyMfa,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Set up multer for profile photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.id + '_profile' + ext);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed!'));
  },
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/change-password', protect, changePassword);
router.post('/request-password-reset', requestPasswordReset);
router.put('/reset-password/:token', resetPassword);
router.put('/profile', protect, updateProfile);
router.post('/verify-mfa', verifyMfa);

// Profile photo upload route
router.post('/profile-photo', protect, upload.single('photo'), async (req, res) => {
  try {
    const user = req.user;
    user.profilePhoto = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ message: 'Profile photo updated!', profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to upload photo' });
  }
});

module.exports = router;
