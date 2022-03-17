// import our Tour model
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
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

exports.aliasTopTours = async (req, res, next) => {
  // this function will get the top tours based on price and rating
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};

// Async functions return a promise. So we'll need to use await here as well as store the returned data
exports.getAllTours = async (req, res) => {
  // console.log(req.query);

  try {
    // before creating class using below code

    // 1) BUILD QUERY
    // const queryObject = { ...req.query }; // copy the query using destructuring
    // const excludedFields = ['page', 'sort', 'limit', 'fields']; // fields to exclude
    // excludedFields.forEach((el) => delete queryObject[el]); // deletes fields that aren't wanted

    // // 1B) ADVANCED FILTERING

    // let queryString = JSON.stringify(queryObject); // turn query object into string
    // queryString = queryString.replace(
    //   /\b(gte|gt|lte|lt)\b/g,
    //   (match) => `$${match}`
    // ); // basically we replace gte gt lte with $ infront

    // /!\ here we so here we
    // let query = Tour.find(JSON.parse(queryString)); // query the DB using the Tour handler

    // after we've made our query, we can now sort using whatever values are in sort
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy); // req.query.sort === price
    // } else {
    //   query = query.sort('-createdAt');
    // }

    // field limiting
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v'); // only selects what is placed into the fields value
    // }

    // pagination - e.g. page=2&limit=10
    // const page = req.query.page * 1 || 1;
    // const limit = req.query.limit * 1 || 100;
    // const skip = (page - 1) * limit;
    // query = query.skip(skip).limit(limit); // limit is the # we want in the query.

    // execute the query
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // send the response
    res
      .status(200)
      .json({ status: 'success', resuls: tours.length, data: { tours } });
  } catch (err) {
    console.log(err);
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
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getTourStats = async (req, res) => {
  // here we are going to calculate some stats from our tours

  try {
    // we define stages within our aggregate function
    // the documents pass through these stages one by one
    // each stage is an object
    const stats = await Tour.aggregate([
      // match stage (stage ONE)
      {
        $match: { ratingsAverage: { $gte: 4.5 } }, // get documents where ratingsAvrage >= 4.5
      },
      // group stage (stage TWO)
      {
        $group: {
          _id: '$ratingsAverage', // this specifies what we want to group by
          numTours: { $sum: 1 }, // for each document, one will be added to this numTours counter
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' }, // calculates avg for field ratingsAverage and stores in avgRating
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 }, // which field to sort by (remember we need to use the fields in the previous stage)
      },
    ]);
    res.status(201).json({
      status: 'success',
      stats: {
        tourStats: stats,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getMonthyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1;

    const plan = await Tour.aggregate([
      // stage one
      {
        // Deconstructs an array field from the input documents to output a document for each element
        // so basically as there were 3 start dates in each document, unwind will now have one start date per document
        $unwind: '$startDates',
      },
      // stage two
      {
        $match: {
          startDates: {
            // have date only for one year e.g. 01-Jan to 31-Dec
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      // stage three
      {
        $group: {
          _id: { $month: '$startDates' }, // what to group by
          numTourStarts: { $sum: 1 }, // we want how many tours start in that month
          tours: { $push: '$name' }, // create an array and push the name of each tour as an element into this array
        },
      },
      // stage four
      {
        $addFields: { month: '$_id' },
      },
      // stage five
      {
        $project: {
          _id: 0, // Id will no longer show up or place value as 1 to keep it showing up
        },
      },
      // stage six
      {
        $sort: { numTourStarts: 1 }, // sort by numTourStarts in ascending order
      },
    ]);

    res.status(201).json({
      status: 'success',
      stats: {
        tourPlan: plan,
      },
    });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};
