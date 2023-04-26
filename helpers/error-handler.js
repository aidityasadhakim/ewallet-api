function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "User is not authorized",
    });
  }

  return res.status(500).json({
    message: err.message,
  });
}

export default errorHandler;
