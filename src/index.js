import dotenv from "dotenv";
dotenv.config({ path: "./src/.env" });

import { app } from "./app.js";
import connectDB from "./db/index.js";
import { initCloudinary } from "./utils/cloudinary.js";

const port = process.env.PORT || 8000;


// Initialize cloudinary now that dotenv has loaded env vars
initCloudinary();

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
