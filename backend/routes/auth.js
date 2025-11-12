const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const { generateOTP, sendOTPEmail } = require('../utils/emailService');

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

    // Check if user is admin (email ends with @admin.com)
    const isAdmin = email.toLowerCase().endsWith('@admin.com');

    if (isAdmin) {
      // Admin users - auto-verify, no OTP required
      const newUser = new User({ 
        name, 
        email, 
        password, 
        department, 
        staffNumber, 
        phone,
        isVerified: true, // Auto-verify admin
        otp: null,
        otpExpiry: null
      });
      await newUser.save();

      res.status(201).json({ 
        message: 'Admin registration successful! You can now login.',
        isAdmin: true,
        skipOTP: true
      });
    } else {
      // Regular users - require OTP verification
      const otp = generateOTP();
      const otpExpiry = Date.now() + 600000; // 10 minutes

      const newUser = new User({ 
        name, 
        email, 
        password, 
        department, 
        staffNumber, 
        phone,
        isVerified: false,
        otp,
        otpExpiry
      });
      await newUser.save();

      // Send OTP email
      const emailSent = await sendOTPEmail(email, name, otp);

      if (!emailSent) {
        return res.status(500).json({ message: 'Failed to send verification email. Please try again.' });
      }

      res.status(201).json({ 
        message: 'Registration successful! Please check your email for OTP verification.',
        email: email // Send email back so frontend knows where OTP was sent
      });
    }

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required' });
  }

  try {
    const user = await User.findOne({ 
      email,
      otp,
      otpExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully! You can now login.' });

  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Resend OTP
router.post('/resend-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'Email already verified' });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = Date.now() + 600000; // 10 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, user.name, otp);

    if (!emailSent) {
      return res.status(500).json({ message: 'Failed to resend verification email. Please try again.' });
    }

    res.status(200).json({ message: 'OTP resent successfully! Please check your email.' });

  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ message: 'Server error during OTP resend' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // Check if email is verified
    if (!user.isVerified) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true,
        email: email
      });
    }

    // Determine role based on email domain
    const role = email.toLowerCase().endsWith('@admin.com') ? 'admin' : 'user';

    // Return user data with role
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      department: user.department,
      staffNumber: user.staffNumber,
      phone: user.phone,
      isVerified: user.isVerified,
      role: role // Add role field
    });

  } catch (err) {
    console.error('Login error:', err);
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
