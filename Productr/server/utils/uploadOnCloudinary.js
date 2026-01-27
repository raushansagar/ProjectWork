
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

const uploadOnCloudinary = async (localFilePath) => {
  try {
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "uploads"
    });

    fs.unlinkSync(localFilePath);
    return result;
  } catch (error) {
    console.log("Upload error:", error);
    return null;
  }
};

export default uploadOnCloudinary;
