const axios = require('axios');

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email using Brevo API (works on Render free tier)
const sendOTPEmail = async (recipientEmail, recipientName, otp) => {
  console.log(`📧 Attempting to send OTP to: ${recipientEmail}`);
  
  try {
    const response = await axios.post(
      'https://api.brevo.com/v3/smtp/email',
      {
        sender: {
          name: 'Classroom Booking System',
          email: process.env.EMAIL_USER
        },
        to: [
          {
            email: recipientEmail,
            name: recipientName
          }
        ],
        subject: 'Email Verification - Classroom Booking System',
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #7C3AED; text-align: center;">📧 Email Verification</h2>
            <p>Hello <strong>${recipientName}</strong>,</p>
            <p>Thank you for registering with our Classroom Booking System!</p>
            <p>Your One-Time Password (OTP) for email verification is:</p>
            <div style="background-color: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; color: #7C3AED; letter-spacing: 5px; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #666;">This OTP is valid for <strong>10 minutes</strong>.</p>
            <p style="color: #666;">If you didn't request this, please ignore this email.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #999; text-align: center;">Classroom Booking System - Automated Email</p>
          </div>
        `
      },
      {
        headers: {
          'accept': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'content-type': 'application/json'
        }
      }
    );
    
    console.log(`✅ OTP email sent successfully to ${recipientEmail}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending email:', error.response?.data || error.message);
    return false;
  }
};

module.exports = { generateOTP, sendOTPEmail };
