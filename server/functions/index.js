const handleError = ({ statusCode, res, message }) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

module.exports = { handleError };
