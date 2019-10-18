const Geocoder = require('node-geocoder');

const options = {
  provider: process.env.GEOCODER_PROVIDER,
  httpAdatpter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = Geocoder(options);

module.exports = geocoder;
