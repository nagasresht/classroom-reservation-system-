const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

router.post('/register', async (req, res) => {
  const { name, email, password, department, staffNumber, phone } = req.body;

  // Validate all required fields
  if (!name || !email || !password || !department || !staffNumber || !phone) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate phone number: exactly 10 digits
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({ name, email, password, department, staffNumber, phone });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Forgot Password - Generate reset token
router.post('/forgot-password', async (req, res) => {
  const { email, phone } = req.body;

  if (!email || !phone) {
    return res.status(400).json({ message: 'Email and phone number are required' });
  }

  // Validate phone number format
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
  }

  try {
    // Find user with matching email AND phone number
    const user = await User.findOne({ email, phone });
    
    if (!user) {
      return res.status(404).json({ message: 'No user found with this email and phone number combination' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // In a real app, send email with reset link
    // For demo purposes, we return the token
    res.status(200).json({ 
      message: 'Identity verified successfully. Redirecting to reset password...', 
      resetToken // In production, send this via email instead
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// Reset Password - Validate token and update password
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: 'Token and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  try {
    const user = await User.findOne({ 
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = password;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });

  } catch (err) {
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

module.exports = router;
