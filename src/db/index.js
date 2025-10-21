import mongoose from "mongoose";
import { db_name } from "../constants.js";

const connectDB = async () => {
  try {
    const MONGO_URI = `mongodb+srv://kakababawasim12345:gufran123@mycollection.yjgbeht.mongodb.net/${db_name}`;
    console.log("🧪 Connecting to MongoDB:", MONGO_URI);

    const connection = await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected! Host: ${connection.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
