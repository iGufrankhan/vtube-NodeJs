import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const fsPromises = fs.promises;

// Cloudinary must be initialized after dotenv loads environment variables.
const initCloudinary = () => {
    const missing = [];
    if (!process.env.CLOUDINARY_CLOUD_NAME) missing.push("CLOUDINARY_CLOUD_NAME");
    if (!process.env.CLOUDINARY_API_KEY) missing.push("CLOUDINARY_API_KEY");
    if (!process.env.CLOUDINARY_API_SECRET) missing.push("CLOUDINARY_API_SECRET");
    if (missing.length) {
        console.warn("Cloudinary env vars missing:", missing.join(", "));
    }

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
};

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    let response = null;
    try {
        response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        return response;
    } catch (error) {
        console.error("Cloudinary upload failed:", error && error.message ? error.message : error);
        return null;
    } finally {
        // Always try to remove the local temporary file. Ignore ENOENT.
        try {
            await fsPromises.unlink(localFilePath);
        } catch (err) {
            if (err && err.code !== "ENOENT") {
                console.error("Failed to remove temp file:", err);
            }
        }
    }
};

const deleteFromCloudinary=async(public_id)=>
{
   try {
      const res=await cloudinary.uploader.destroy(public_id)
      console.log("deletion from cloudinary",public_id)
   } catch (error) {
       console.log("error deleting from cloudinary ",error)
   }
}


export { uploadOnCloudinary, initCloudinary,deleteFromCloudinary };