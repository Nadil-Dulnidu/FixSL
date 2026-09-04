import { v2 as cloudinary } from "cloudinary";
import { logger } from "@/lib/logger";
import { UploadError } from "@/lib/errors";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const isConfigured = Boolean(cloudName && apiKey && apiSecret);

if (isConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
} else {
  logger.warn("Cloudinary is not fully configured with environment variables. Image uploads will use mock/fallback handler.");
}

/**
 * Upload an image file buffer or base64 data to Cloudinary
 */
export async function uploadImageToCloudinary(
  file: File | Blob | string,
  folder = "fixsl/issues"
): Promise<string | null> {
  if (!file) return null;

  try {
    // If Cloudinary credentials are not configured, log and return null or placeholder
    if (!isConfigured) {
      logger.warn("Skipping Cloudinary upload: missing credentials", { folder });
      return null;
    }

    let buffer: Buffer;
    if (typeof file === "string") {
      // Base64 data URL
      const base64Data = file.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, "base64");
    } else {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            { width: 1200, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary upload failed", { error: error.message });
            reject(new UploadError("Failed to upload image to Cloudinary", { originalError: error.message }));
          } else if (result?.secure_url) {
            logger.info("Cloudinary upload success", { url: result.secure_url, publicId: result.public_id });
            resolve(result.secure_url);
          } else {
            reject(new UploadError("No secure_url returned from Cloudinary"));
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    logger.error("Error in uploadImageToCloudinary", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    // Return null instead of throwing if we want graceful degradation
    return null;
  }
}
