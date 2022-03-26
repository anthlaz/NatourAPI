module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500; //statusCode = statusCode if statusCode is valid OR place as 500 if not
  err.status = err.status || 'err';

  res.status(err.statusCode).json({ status: err.status, message: err.message });
};
