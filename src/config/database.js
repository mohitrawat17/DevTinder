const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://mr5191890:OVdToMxz2xz3dMOP@namastenodejs.gtqanwr.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
 