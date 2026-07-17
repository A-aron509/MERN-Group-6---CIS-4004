const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/sendEmail');

const SALT_ROUNDS = 10;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
  return res.status(400).json({
    message: 'Full name, email, and password are required.'
  });
}

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const newUser = await User.create({
      fullName: fullName.trim(),
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    await sendVerificationEmail(newUser.email, verificationToken);

    res.status(201).json({
      message: 'Account created. Please check your email to verify your account.',
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// GET /api/auth/verify-email?token=...
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (err) {
    console.error('Verify email error:', err);
    res.status(500).json({ message: 'Server error during verification.' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

if (!email || !password) {
  return res.status(400).json({
    message: 'Email and password are required.'
  });
}

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// POST /api/auth/google
// Frontend sends the ID token it got from Google Sign-In. We verify it,
// then find or create the matching user and issue our own JWT — same
// shape as a normal login response.
const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'Google ID token is required.' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { sub: googleId, email, name } = payload;

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // If they registered with email/password before and are now using
      // Google with the same email, link the accounts.
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Google already verified this email
        if (!user.fullName) {
          user.fullName = name || email.split('@')[0]; // backfill for older accounts
        }
        await user.save();
      }
    } else {
      user = await User.create({
        fullName: name || email.split('@')[0],
        email,
        googleId,
        isVerified: true, // Google-verified email, no need for our own link
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Google login successful.',
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error('Google auth error:', err);
    res.status(401).json({ message: 'Google authentication failed.' });
  }
};

module.exports = { register, login, verifyEmail, googleAuth };
