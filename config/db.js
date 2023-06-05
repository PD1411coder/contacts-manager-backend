const mongoose = require("mongoose");

const ConnetToDb = async() => {
  return mongoose
    .connect(
      "mongodb+srv://admin:admin@contactmanager.j5icb.mongodb.net/?retryWrites=true&w=majority"
    )
    .then(() => {
      console.log("mongoose connect");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = ConnetToDb;