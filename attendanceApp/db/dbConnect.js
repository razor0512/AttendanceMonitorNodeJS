const mongoose = require('mongoose');

async function dbConnect () {
  const connect = await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

  console.log(`MongoDB is now connected: ${connect.connection.host}`);
}

module.exports = dbConnect;
