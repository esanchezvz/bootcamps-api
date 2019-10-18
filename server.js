const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Load environment variables
dotenv.config({ path: './config/config.env' });

// Connect to DB
connectDB();

// Route files
const bootcamps = require('./routes/bootcamps');

// Server middlewares
process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : null;

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.listen(
  PORT,
  console.log(`🌎 Server listening on port ${PORT} in ${process.env.NODE_ENV} mode.`),
);
