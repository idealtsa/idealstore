import mongoose from "mongoose";

const connectMongoose = async () => {
  if (mongoose.connections[0].readyState) {
    console.log("Already Mongoose is Connected");
  } else {

    if (!process.env.MONGODB_URI) {
      throw new Error('Add Mongo URI to .env.local')
    }
    mongoose.connect(process.env.MONGODB_URI, {}, (err) => {
      if (err) throw new Error(`Mongoose conection error:${err}`)
      console.log("Connected to mongoose");
    });
  }
};

export default connectMongoose;
