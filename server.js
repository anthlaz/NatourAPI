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

// 2) START SERVER
const port = 8000;
app.listen(port, () => {
  // this callback will be executed when the server runs
  console.log(`App is running on port ${port}...`);
});
