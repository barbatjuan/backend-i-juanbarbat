const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.error("Entro al error handler!");
  console.error(err.stack);
  res.status(500).send("Something broke!");
};

export default errorHandler;
