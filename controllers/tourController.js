const fs = require('fs');
// read the tours data and parse it into a JSON object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

// Tour route handlers

exports.getAllTours = (req, res) => {
  // this callback is usually called the ROUTE HANDLER
  // So what happens when the endpoint gets hit?
  // 1. We need to get the data (but not in the callback function)
  // 2. Send it back to the client with an added success data point

  res
    .status(200)
    .json({ status: 'success', results: tours.length, data: { tours } });
};

exports.getTour = (req, res) => {
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

exports.createTour = (req, res) => {
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

exports.updateTour = (req, res) => {
  // this is the function that we would use to update data in the database

  // dummy response
  res.status(200).json({ status: 'Success!' });
};

exports.deleteTour = (req, res) => {
  // this is the function that we would use to update data in the database

  // dummy response
  res.status(200).json({ status: 'Success!' });
};
