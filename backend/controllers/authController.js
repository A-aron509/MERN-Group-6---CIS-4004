const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/sendEmail');
const QRCode = require('qrcode');

const SALT_ROUNDS = 10;
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

let otplib;

const getOtplib = async () => {
  if (!otplib) {
    otplib = await import('otplib');
  }

  return otplib;
};

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

    if (user.twoFactorEnabled) {
  const twoFactorToken = jwt.sign(
    {
      userId: user._id,
      purpose: '2fa-login',
    },
    process.env.JWT_SECRET,
    { expiresIn: '5m' }
  );

  return res.status(200).json({
    message: 'Enter the code from your authenticator app.',
    requiresTwoFactor: true,
    twoFactorToken,
  });
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
        fullName: user.fullName,
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

// POST /api/auth/2fa/setup
const setupTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        message: 'Please verify your email before enabling two-factor authentication.',
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        message: 'Two-factor authentication is already enabled.',
      });
    }

    const { generateSecret, generateURI } = await getOtplib();

    const secret = generateSecret();

    const uri = generateURI({
      issuer: 'StayFresh',
      label: user.email,
      secret,
    });

    const qrCode = await QRCode.toDataURL(uri);

    user.twoFactorSecret = secret;
    await user.save();

    return res.status(200).json({
      message: 'Scan the QR code with your authenticator app.',
      qrCode,
      manualKey: secret,
    });
  } catch (err) {
    console.error('2FA setup error:', err);

    return res.status(500).json({
      message: 'Server error while setting up two-factor authentication.',
    });
  }
};

// POST /api/auth/2fa/confirm
const confirmTwoFactor = async (req, res) => {
  try {
    const { token } = req.body;
    const normalizedToken = String(token || '').trim();

    if (!/^\d{6}$/.test(normalizedToken)) {
      return res.status(400).json({
        message: 'Enter the six-digit code from your authenticator app.',
      });
    }

    const user = await User.findById(req.userId)
      .select('+twoFactorSecret');

    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        message: 'Two-factor authentication is already enabled.',
      });
    }

    if (!user.twoFactorSecret) {
      return res.status(400).json({
        message: 'Start two-factor authentication setup first.',
      });
    }

    const { verify } = await getOtplib();

    const result = await verify({
      secret: user.twoFactorSecret,
      token: normalizedToken,
    });

    if (!result.valid) {
      return res.status(400).json({
        message: 'The authenticator code is invalid or has expired.',
      });
    }

    user.twoFactorEnabled = true;
    await user.save();

    return res.status(200).json({
      message: 'Two-factor authentication has been enabled successfully.',
    });
  } catch (err) {
    console.error('2FA confirmation error:', err);

    return res.status(500).json({
      message: 'Server error while confirming two-factor authentication.',
    });
  }
};

// POST /api/auth/2fa/login
const verifyTwoFactorLogin = async (req, res) => {
  try {
    const { twoFactorToken, token } = req.body;
    const normalizedToken = String(token || '').trim();

    if (!twoFactorToken || !/^\d{6}$/.test(normalizedToken)) {
      return res.status(400).json({
        message: 'A login verification token and six-digit code are required.',
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(twoFactorToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: 'The two-factor login session is invalid or has expired.',
      });
    }

    if (decoded.purpose !== '2fa-login' || !decoded.userId) {
      return res.status(401).json({
        message: 'Invalid two-factor login session.',
      });
    }

    const user = await User.findById(decoded.userId)
      .select('+twoFactorSecret');

    if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
      return res.status(401).json({
        message: 'Two-factor authentication is not available for this account.',
      });
    }

    const { verify } = await getOtplib();

    const result = await verify({
      secret: user.twoFactorSecret,
      token: normalizedToken,
    });

    if (!result.valid) {
      return res.status(401).json({
        message: 'The authenticator code is invalid or has expired.',
      });
    }

    const loginToken = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: 'Login successful.',
      requiresTwoFactor: false,
      token: loginToken,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profileComplete: user.profileComplete,
      },
    });
  } catch (err) {
    console.error('2FA login verification error:', err);

    return res.status(500).json({
      message: 'Server error while verifying two-factor authentication.',
    });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  googleAuth,
  setupTwoFactor,
  confirmTwoFactor,
  verifyTwoFactorLogin,
};
