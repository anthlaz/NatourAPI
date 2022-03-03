/** WHAT WILL THE ROUTE FOLDERS CONTAIN?
 * 1. Route handlers will need to be imported
 * 2. Router will need to be created for this specific resource/route
 * 3. The Router will have:
 *      1. The associated resources for this route
 *      2. Any controllers/route handlers associated with each resource
 * 4. The Router will then be exported to our app.js
 */

const express = require('express');

// import our controllers/route handlers for route
const tourController = require('./../controllers/tourController');

// Create the tour Router
const tourRouter = express.Router();

// this is ParamMiddleware, look at the controller file to see how this function works.
// Note: parameter name is arbitrary
tourRouter.param('id', tourController.checkID);

// create a checkBody middleware
// check if body contains the name and price property
// if not, send back 400 response

tourRouter
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody, tourController.createTour); // here we are chaining middleware

tourRouter
  .route('/:id') // this parameter name is how we identify it in the route handler/controller functions
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

// export our tourRouter
module.exports = tourRouter;
