const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');

const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');

const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

// Dev logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

// Server middlewares
app.use(errorHandler);

const server = app.listen(
  PORT,
  console.log(
    `\n🌎  Server listening on port`,
    `${PORT}`.green.bold,
    `in`,
    `${process.env.NODE_ENV}`.green.bold,
    `mode.`,
  ),
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`❌  Unhandled error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
