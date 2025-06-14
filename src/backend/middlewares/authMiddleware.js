const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Log the decoded token for debugging
    console.log('Decoded token:', decoded);
    
    // Make sure the decoded token has the expected structure
    if (!decoded.id && !decoded.userId && !decoded._id) {
      console.error('Invalid token structure:', decoded);
      return res.status(401).json({ message: 'Invalid token structure' });
    }
    
    // Set the user ID in the request object
    req.user = {
      id: decoded.id || decoded.userId || decoded._id,
      ...decoded
    };
    
    console.log('Authenticated user ID:', req.user.id);
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
