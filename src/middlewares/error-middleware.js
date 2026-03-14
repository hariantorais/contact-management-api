const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  // menangani error dari joi
  if (err.isJoi) {
    return res.status(400).json({
      status: "fail",
      errors: err.details.map((d) => d.message),
    });
  }

  // 2. error custom
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "fail",
    message: message,
  });
};

module.exports = errorMiddleware;
