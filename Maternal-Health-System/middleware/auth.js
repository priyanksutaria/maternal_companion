import jwt from 'jsonwebtoken';

// Middleware for JWT authentication
const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: req.t('errors.noToken') });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach PHC/ANM user info
    next();
  } catch (err) {
    return res.status(401).json({ error: req.t('errors.invalidToken') });
  }
};

export default authenticate;