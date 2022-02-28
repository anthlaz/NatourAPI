// 0) import express
const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
// declare our app var
const app = express();

// 1) middleware
app.use(morgan('dev'));
app.use(express.json());

app.use((req, res, next) => {
  console.log("We're currently inside the middleware");
  next(); // need to call next()
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next(); // need to call next()
});
// read the tours data and parse it into a JSON object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// 2) ROUTE HANDLERS
const getAllTours = (req, res) => {
  // this callback is usually called the ROUTE HANDLER
  // So what happens when the endpoint gets hit?
  // 1. We need to get the data (but not in the callback function)
  // 2. Send it back to the client with an added success data point

  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

const getTour = (req, res) => {
  console.log(req.params);
  // print middleware time
  console.log(req.requestTime);

  //convert to integer
  const id = req.params.id * 1;
  // error checker
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({ status: 'success', data: { tour } });
};

const createTour = (req, res) => {
  // In post requests we'll have information from the client.

  const newID = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newID }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // 201 is for CREATED
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

const updateTour = (req, res) => {
  // this is the function that we would use to update data in the database

  // dummy response
  res.status(200).json({ status: 'Success!' });
};

const deleteTour = (req, res) => {
  // this is the function that we would use to update data in the database

  // dummy response
  res.status(200).json({ status: 'Success!' });
};

const getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};

const deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route is not yet defined' });
};
// 3) ROUTES
// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

// easier to read that the above
app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// 4) START SERVER
const port = 8000;
app.listen(port, () => {
  // this callback will be executed when the server runs
  console.log(`App is running on port ${port}...`);
});
