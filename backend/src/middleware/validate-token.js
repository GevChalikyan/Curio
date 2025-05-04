function validateToken(req, res, next) {
  
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.slice(7);
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      const expired = err.name === 'TokenExpiredError';
      return res
        .status(401)
        .json({ message: expired ? 'Token expired' : 'Invalid token' });
    }

    req.user = { userId: payload.userId, username: payload.username };
    next();
  });
  
}

module.exports = validateToken;