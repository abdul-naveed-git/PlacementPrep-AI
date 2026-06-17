const mongoose = require("mongoose");

const connectDB = async () => {
  const uri =
    "mongodb://23501a4201_db_user:zXyEz1AxreDPdkFu@ac-3aed1ob-shard-00-00.9vlf0jh.mongodb.net:27017,ac-3aed1ob-shard-00-01.9vlf0jh.mongodb.net:27017,ac-3aed1ob-shard-00-02.9vlf0jh.mongodb.net:27017/?ssl=true&replicaSet=atlas-xajd7m-shard-0&authSource=admin&appName=Cluster0";
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = connectDB;
