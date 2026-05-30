const User = require('../models/User');
const jwt = require('jsonwebtoken');
const sendEmailOTP = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecretjwtkey', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Create user (unverified by default)
    const user = await User.create({
      username,
      email,
      password,
      isVerified: false,
      otp,
      otpExpires
    });

    if (user) {
      // Trigger OTP email delivery asynchronously in the background so slow SMTP doesn't block the UI
      sendEmailOTP(user.email, otp)
        .then(res => console.log('Background email sent:', res))
        .catch(err => console.error('Background email failed:', err));
      
      res.status(201).json({
        message: 'Registration successful! An OTP code has been sent to your email.',
        email: user.email
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if account is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        message: 'Your email account is not verified yet. Please enter the OTP code.',
        email: user.email,
        notVerified: true
      });
    }

    // Check password match
    if (await user.matchPassword(password)) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Login Verification
// @route   POST /api/auth/google-login
// @access  Public
const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID Token is required' });
    }

    let email;
    let name;

    // Check if Google Client ID is configured in .env
    if (process.env.GOOGLE_CLIENT_ID) {
      try {
        const ticket = await googleClient.verifyIdToken({
          idToken,
          audience: process.env.GOOGLE_CLIENT_ID
        });
        const payload = ticket.getPayload();
        email = payload.email;
        name = payload.name;
      } catch (verificationError) {
        console.error('Google ID Token verification failed:', verificationError.message);
        return res.status(401).json({ message: 'Invalid or expired Google token signature' });
      }
    } else {
      // Development Fallback: decode JWT payload without verification
      console.warn('Warning: GOOGLE_CLIENT_ID is not set in backend .env. Operating in development mode (decoding token signature without validating).');
      const decoded = jwt.decode(idToken);
      if (decoded) {
        email = decoded.email;
        name = decoded.name || decoded.given_name;
      } else {
        return res.status(400).json({ message: 'Failed to decode Google ID Token' });
      }
    }

    if (!email) {
      return res.status(400).json({ message: 'Google ID Token does not contain an email address' });
    }

    // Check if user exists in database
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-generate username from email as fallback
      const baseUsername = email.split('@')[0];
      const generatedUsername = baseUsername + Math.floor(100 + Math.random() * 900);
      
      // Auto-generate a secure password fallback
      const generatedPassword = Math.random().toString(36).slice(-8) + 'G1!';

      user = await User.create({
        username: name || generatedUsername,
        email,
        password: generatedPassword,
        isVerified: true // Pre-verified by Google OAuth
      });
    } else {
      // Update username to Google account name and mark pre-verified
      let shouldSave = false;
      if (name && user.username !== name) {
        user.username = name;
        shouldSave = true;
      }
      if (!user.isVerified) {
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    }

    res.status(200).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify OTP for registration
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Please provide email and OTP code' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This email account has already been verified' });
    }

    // Validate OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check expiration
    if (user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' });
    }

    // Mark as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({
      message: 'Account verified successfully! You can now log in.',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'This account has already been verified' });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    // Trigger email delivery asynchronously
    sendEmailOTP(user.email, otp)
      .then(res => console.log('Background resend email sent:', res))
      .catch(err => console.error('Background resend email failed:', err));

    res.status(200).json({
      message: 'A new verification code has been sent to your email.',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  googleLogin,
  verifyOTP,
  resendOTP
};
