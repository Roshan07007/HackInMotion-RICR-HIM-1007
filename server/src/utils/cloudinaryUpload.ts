import cloudinary from "../config/cloudinary.js";
import logger from "./logger.js";

const uploadToCloudinary = async (file: any, options: any = {}) => {
  if (!file?.buffer) {
    throw new Error("Invalid file.");
  }
  const dataURI = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(dataURI, {
    folder: options.folder || "uploads",
    ...options,
  });
  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
};

export const uploadSingleToCloudinary = async (
  file: any,
  options: any = {},
) => {
  try {
    return await uploadToCloudinary(file, options);
  } catch (error: any) {
    logger.error("Cloudinary Upload Error", error);
    throw new Error(error?.message || "Failed to upload file.");
  }
};

export const uploadMultipleToCloudinary = async (
  files: any[] = [],
  options: any = {},
) => {
  try {
    return await Promise.all(
      files.map((file) => uploadToCloudinary(file, options)),
    );
  } catch (error: any) {
    logger.error("Cloudinary Upload Error", error);
    throw new Error(error?.message || "Failed to upload files.");
  }
};

export const deleteFromCloudinary = async (publicId: string) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    logger.error("Cloudinary Delete Error", error);
    throw new Error(error?.message || "Failed to delete file.");
  }
};
