// 0) import modules needed
const express = require('express');
const morgan = require('morgan');

// create our express app
const app = express();

// OUR OWN MODULES
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// 1) middleware
app.use(morgan('dev'));
app.use(express.json());

// below is a middleware example
// app.use((req, res, next) => {
//   console.log("We're currently inside the middleware");
//   next(); // need to call next()
// });

// 2) ROUTE HANDLERS
//  - None will be here
//  - use the routers imported (which are effectively middleware)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
