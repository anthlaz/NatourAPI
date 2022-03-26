// 0) import modules needed
const express = require('express');
const morgan = require('morgan');

// create our express app
const app = express();
// OUR OWN MODULES
const AppError = require('./utils/AppError');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) middleware
app.use(morgan('dev'));
app.use(express.json());

// allow us to use static files in express
app.use(express.static(`${__dirname}/public`));

// below is a middleware example
// app.use((req, res, next) => {
//   console.log("We're currently inside the middleware");
//   next(); // need to call next()
// });

// 2) ROUTES
//  - use the routers imported (which are effectively middleware)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// handling any other route all() includes .get().post.patch() etc
// this means that this code will run for all routes that aren't handled above
app.all('*', (req, res, next) => {
  //   res.status(404).json({
  //     status: 'fail',
  //     message: `Cannot find ${req.originalUrl} on this server, pal!`,
  //   });

  //   const err = new Error(`Cannot find ${req.originalUrl} on this server, pal!`);
  //   err.status = 'fail';
  //   err.statusCode = 404;
  next(
    new AppError(`Cannot find ${req.originalUrl} on this server, pal!`, 404)
  ); // if next has an argument, then express automatically takes this as an error has occurred, skips all other middleware
  // and ends up goign to the error handling middleware
});

// central error handling middleware
// if the callback function has 4 arguments, then express recognises this as error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500; //statusCode = statusCode if statusCode is valid OR place as 500 if not
  err.status = err.status || 'err';

  res.status(err.statusCode).json({ status: err.status, message: err.message });
});
module.exports = app;
