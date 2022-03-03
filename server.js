const dotenv = require('dotenv');
// import our app
const app = require('./app');

// connect our config.env file to our node application
dotenv.config({ path: './config.env' });

console.log('hel');
// 2) START SERVER
const port = 8000;
app.listen(port, () => {
  // this callback will be executed when the server runs
  console.log(`App is running on port ${port}...`);
});
