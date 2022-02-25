// import express
const express = require('express');

// declare our app var
const app = express();

// ROUTES
app.get('/', (req, res) => {
  // callback function that will be executed when this route is hit
  res.status(200).json({ message: 'Hello from the server.', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint....');
});
// SERVER
const port = 8000;
app.listen(port, () => {
  // this callback will be executed when the server runs
  console.log(`App is running on port ${port}...`);
});
