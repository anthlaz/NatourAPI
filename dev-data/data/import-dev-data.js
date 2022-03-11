// this script will import our dev data into our mongodb database

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../models/tourModel');
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

// read json file to get data
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// import data to database
const importData = async () => {
  try {
    await Tour.create(tours); // create also accepts array of objects
    console.log('data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// delete all current data from collection
const deleteData = async () => {
  try {
    await Tour.deleteMany(); // deletes all documents in a collection
    console.log('data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

// log process args
console.log(process.argv);
