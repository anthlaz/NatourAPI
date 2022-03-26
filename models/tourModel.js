const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator'); // external validator library
// create the tours schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // required is a validator
      unique: true,
      trim: true,
      maxlength: [40, 'Tour name must have less or equal to 40 characters'],
      minlength: [10, 'Tour name must have more or equal to 10 characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be Easy, medium, or difficult', // basically these are the option values that can be entered
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating be above 1.0'],
      max: [5, 'Rating be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message:
          'Discount price {{VALUE }}must be lower than the regular price', // VALUE represents
      },
    },
    summary: {
      type: String,
      trim: true, // trim will remove all whitespace in beginning of string and the end.
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String, // will be the reference to the image
      required: [true, 'A tour must have a cover image'],
    },
    images: [String], // this will enable us to save an array of strings, which will be used to store refs of images in the tour
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  }, // schema options
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// A virtual property is something that isn't stored in the database
// In this example, we convert our duration property to weeks and send that back to the user
// used regular function as an arrow funciton doesn't get it's own "this" keyword
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// Note, we define middleware on the schema.
// this refers to the document that is going to be saved
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next(); // calls the next middleware
});

// DOCUMENT MIDDLEWARE: these  occur before and after 'save' event
// tourSchema.pre('save', function (next) {
//   console.log('will save docuemnt...');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// could have also been just for 'find' hook by doing it like: tourSchema.pre('find', function (next) {
// instead a reg exp. has been used for 'find'
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  next();
});

// query middleware AFTER the find...() has been executed
tourSchema.post(/^find/, function (docs, next) {
  console.log(docs);
  next();
});

// AGGREGATE MIDDLEWARE
// removes secretTour from output using the aggregate hook (so there are many ways to do this type of stuff)
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
});
// now from the schema create a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
