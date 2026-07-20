const jwt = require('jsonwebtoken');

// Protects routes by checking for a valid JWT in the Authorization header.
// Usage: router.get('/profile', requireAuth, profileController.getProfile);
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
  console.log("JWT_SECRET exists?", !!process.env.JWT_SECRET);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.userId = decoded.userId;
  next();
} catch (err) {
  console.log(err);
  return res.status(401).json({ message: 'Invalid or expired token.' });
}
};

module.exports = requireAuth;
