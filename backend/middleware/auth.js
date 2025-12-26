const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const authenticateAdmin = async (req, res, next) => {
  let token;
  try {
    token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      console.error('❌ Auth failed: No token provided');
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
    const admin = await Admin.findByPk(decoded.id);

    if (!admin) {
      console.error('❌ Auth failed: Admin not found for ID:', decoded.id);
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    
    let errorMessage = 'Invalid or expired token';
    if (error.name === 'JsonWebTokenError') {
      if (error.message === 'invalid signature') {
        errorMessage = 'Token signature is invalid. This usually means the JWT_SECRET has changed or the token was created with a different secret. Please log out and log back in.';
      } else if (error.message === 'jwt malformed') {
        errorMessage = 'Token format is invalid.';
      } else {
        errorMessage = `Token error: ${error.message}`;
      }
    } else if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token has expired. Please log in again.';
    }
    
    return res.status(401).json({ 
      error: errorMessage,
      details: error.message,
      type: error.name
    });
  }
};

module.exports = { authenticateAdmin };

