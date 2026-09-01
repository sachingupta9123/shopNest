const mongoose = require('mongoose');
const dns = require('dns');

// Fix MongoDB Atlas SRV DNS resolution
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  const opts = {
    serverSelectionTimeoutMS: 10000,
  };

  const primary = process.env.MONGO_URI;
  const fallback =
    process.env.MONGO_URI_LOCAL ||
    'mongodb://127.0.0.1:27017/shopnest';

  try {
    await mongoose.connect(primary, opts);

    console.log('MongoDB connected successfully (primary).');
    return;
  } catch (err) {
    console.error(
      'Primary MongoDB connection failed:',
      err.message || err
    );
  }

  try {
    await mongoose.connect(fallback, opts);

    console.log('MongoDB connected successfully (fallback).');
    return;
  } catch (err) {
    console.error(
      'Fallback MongoDB connection failed:',
      err.message || err
    );

    throw err;
  }
};

module.exports = connectDB;