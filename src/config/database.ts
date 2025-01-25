import mongoose from "mongoose";
import { config } from "dotenv";
config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'todo-api';

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB connection FAILED ", error);
    process.exit(1);
  }
};
