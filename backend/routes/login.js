// routes.js
const express = require("express");
const router = express.Router();
const User = require("../models/login");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ankamreddiprudhvi@gmail.com',
    pass: 'rnzu bbvi ugnm jxrv'
  }
});

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/signup", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();

    res.json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp; // This will be encrypted in the pre-save hook
    user.otpExpires = new Date(Date.now() + 600000); // OTP expires in 10 minutes
    await user.save();

    // Send OTP to email
    const mailOptions = {
      from: 'ankamreddiprudhvi@gmail.com',
      to: 'ankamreddiprudhvi2k3@gmail.com',
      subject: 'Login OTP',
      text: `Your OTP for login is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending OTP email:', error);
      }
    });

    res.json({ message: "OTP sent to email", userId: user._id });
  } catch (err) {
    console.error('Error in login route:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { userId, otp } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      console.log('User not found:', userId);
      return res.status(400).json({ message: "User not found" });
    }

    console.log('User found:', user);
    console.log('OTP expiry:', user.otpExpires);
    console.log('Current time:', new Date());

    if (new Date() > user.otpExpires) {
      console.log('OTP expired');
      return res.status(400).json({ message: "Expired OTP" });
    }

    const isOTPValid = await user.compareOTP(otp);
    if (!isOTPValid) {
      console.log('OTP mismatch');
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP fields
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, "P&u#h^!", { expiresIn: '1h' });
    res.json({ token, userId: user._id });
  } catch (err) {
    console.error('Error in verify-otp route:', err);
    res.status(500).json({ error: err.message });
  }
});


router.post("/resend-otp", async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Generate new OTP
    const otp = generateOTP();
    user.otp = otp.toString();
    user.otpExpires = new Date(Date.now() + 600000); // OTP expires in 10 minutes
    await user.save();

    // Send OTP to email
    const mailOptions = {
      from: 'ankamreddiprudhvi@gmail.com',
      to: 'ankamreddiprudhvi2k3@gmail.com',
      subject: 'New Login OTP',
      text: `Your new OTP for login is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending OTP email:', error);
        return res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log('OTP email sent: ' + info.response);
        res.json({ message: "New OTP sent to email" });
      }
    });

  } catch (err) {
    console.error('Error in resend-otp route:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, "P&u#h^!", { expiresIn: "1d" });
    const resetLink = `http://localhost:3000/admin/reset-password/${user._id}/${token}`;

    const mailOptions = {
      from: 'ankamreddiprudhvi@gmail.com',
      to: 'ankamreddiprudhvi2k3@gmail.com',
      subject: 'Reset Password Link',
      text: `Click on this link to reset your password: ${resetLink}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error); // Log the error for debugging
        return res.status(500).json({ message: "Failed to send email" });
      }
      return res.status(200).json({ message: "Password reset link sent to email" });
    });
  } catch (err) {
    console.error('Error in /forgotpassword route:', err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
});


router.post('/reset-password/:id/:token', async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const decoded = jwt.verify(token, "P&u#h^!");
    if (decoded.id !== id) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });

    return res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error('Error in /reset-password route:', err); // Log the error for debugging
    res.status(500).json({ error: err.message });
  }
});

router.get('/verify-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'P&u#h^!');
    
    // Optionally, issue a new token
    const newToken = jwt.sign({ id: decoded.id }, 'P&u#h^!', { expiresIn: '15m' });
    
    res.json({ valid: true, newToken });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;