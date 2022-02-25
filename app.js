// import express
const express = require('express');
const fs = require('fs');
// declare our app var
const app = express();

// ROUTES
// app.get('/', (req, res) => {
//   // callback function that will be executed when this route is hit
//   res.status(200).json({ message: 'Hello from the server.', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can post to this endpoint....');
// });

// read the tours data and parse it into a JSON object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

app.get('/api/v1/tours', (req, res) => {
  // this callback is usually called the ROUTE HANDLER
  // So what happens when the endpoint gets hit?
  // 1. We need to get the data (but not in the callback function)
  // 2. Send it back to the client with an added success data point
  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
});

// SERVER
const port = 8000;
app.listen(port, () => {
  // this callback will be executed when the server runs
  console.log(`App is running on port ${port}...`);
});
