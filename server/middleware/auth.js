const JWT = require('jsonwebtoken');
const Fn = require('../functions/index');

const verifyToken = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return Fn.handleError(401, res, 'Access Token is wrong');
  }
  try {
    const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return Fn.handleError(403, res, 'token is invalid');
  }
};

module.exports = verifyToken;
