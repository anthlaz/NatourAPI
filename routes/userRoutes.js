/** WHAT WILL THE ROUTE FOLDERS CONTAIN?
 * 1. Route handlers will need to be imported
 * 2. Router will need to be created for this specific resource/route
 * 3. The Router will have:
 *      1. The associated resources for this route
 *      2. Any controllers/route handlers associated with each resource
 * 4. The Router will then be exported to our app.js
 */

// import express
const express = require('express');
// import controllers/route handlers for route
const UserController = require('./../controllers/userController');

// create the user router
const userRouter = express.Router();

// User Route
userRouter
  .route('/')
  .get(UserController.getAllUsers)
  .post(UserController.createUser);

userRouter
  .route('/:id')
  .get(UserController.getUser)
  .patch(UserController.updateUser)
  .delete(UserController.deleteUser);

// export userRouter
module.exports = userRouter;
