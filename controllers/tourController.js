// import our Tour model
const Tour = require('./../models/tourModel');

// // read the tours data and parse it into a JSON object
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// param middleware functions

// dont need this middleware as mongoose will take care of checking this
// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'Missing name or price' });
//   }
//   next();
// };

// Tour route handlers

// Async functions return a promise. So we'll need to use await here as well as store the returned data
exports.getAllTours = async (req, res) => {
  console.log(req.query);

  try {
    // first we want to build the query
    const queryObject = { ...req.query }; // copy the query using destructuring
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // fields to exclude
    excludedFields.forEach((el) => delete queryObject[el]); // deletes fields that aren't wanted

    // now we can use advanced filtering with gte, lte etc.
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    ); // basically we replace gte gt lte with $ infront
    console.log(JSON.parse(queryString));
    const query = Tour.find(JSON.parse(queryString));

    // execute the query
    const tours = await query;
    // console.log(req.query);
    // send the response
    res
      .status(200)
      .json({ status: 'success', resuls: tours.length, data: { tours } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // we could also find like: Tour.findOne({ _id: req.params.id})
    const tour = await Tour.findById(req.params.id); // its id here because in routes its '/:id'

    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

// creating documents in Mongoose.
exports.createTour = async (req, res) => {
  // In post requests we'll have information from the client.
  try {
    // we can create a new tour using our schema and model connected to the DB.
    // the Tour.create() will take an input which in this case will be in the req body
    // the result of tour.create() will be saved in the newTour variable.
    // NOTE: anything that is in the body that is not in our schema will be ignored.
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // so what type of errors will this type of action potentially throw?
    res.status(400).json({ status: 'fail', message: 'invalid data sent!' });
  }
};

exports.updateTour = async (req, res) => {
  // this is the function that we would use to update data in the database
  // we can find/update in one command with mongoose. We will use the ID
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(201).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'invalid data sent!' });
  }
};

exports.deleteTour = async (req, res) => {
  // this is the function that we would use to update data in the database
  try {
    const deletedTour = await Tour.findByIdAndDelete(req.params.id); // no options to add in delete
    res.status(201).json({
      status: 'success',
      data: {
        tour: deletedTour,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Incorrect Id for deletion!' });
  }
};
