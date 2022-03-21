const mongoose = require('mongoose');
const slugify = require('slugify');

// create the tours schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
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
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: Number, // no schema type options here
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

// now from the schema create a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
