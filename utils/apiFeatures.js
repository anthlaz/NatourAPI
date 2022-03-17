class APIFeatures {
  // remember this gets called upon creating an instance
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // filtering method
  filter() {
    const queryObject = { ...this.queryString }; // copy the query using destructuring
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // fields to exclude
    excludedFields.forEach((el) => delete queryObject[el]); // deletes fields that aren't wanted

    // 1B) ADVANCED FILTERING

    let queryString = JSON.stringify(queryObject); // turn query object into string
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    ); // basically we replace gte gt lte with $ infront

    this.query = this.query.find(JSON.parse(queryString));
    console.log(this.query);
    // let query = Tour.find(JSON.parse(queryString)); // query the DB using the Tour handler

    return this; // returns the entire object
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy); // req.query.sort === price
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // only selects what is placed into the fields value
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); // limit is the # we want in the query.

    return this;
  }
}

module.exports = APIFeatures;
