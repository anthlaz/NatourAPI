const mongoose = require('mongoose');

// create the tours schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
  },
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
  },
  startDates: [Date],
});

// now from the schema create a model
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
