const mongoose = require('mongoose');
const dotenv = require('dotenv');
// import our app
const app = require('./app');

// connect our config.env file to our node application
dotenv.config({ path: './config.env' });

// 1) connect to our database

// 1a) replace our password in the connection string
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// 1b) connect to database
mongoose.connect(DB).then((con) => {
  console.log('DB connection successful!');
});

// create the tours schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// now from the schema create a model
const Tour = mongoose.model('Tour', tourSchema);

// create tour test documents
const testTour = new Tour({
  name: 'The Park Camper',
  rating: 4.8,
  price: 620,
});

// operate on the testTour document
testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR: ', err);
  });

// 2) START SERVER
const port = 8000;
app.listen(port, () => {
  // this callback will be executed when the server runs
  console.log(`App is running on port ${port}...`);
});
