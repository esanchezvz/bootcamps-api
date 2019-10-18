const mongoose = require('mongoose');
const colors = require('colors');

const connectDb = async () => {
  const connection = await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`🔥  MongoDB connected ${connection.connection.host}`.green.underline.bold);
};

module.exports = connectDb;
