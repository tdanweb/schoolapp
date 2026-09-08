import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Dynamically assign folder based on form field name
    let targetFolder = "staff/general";
    if (file.fieldname === "passport") targetFolder = "staff/passports";
    if (file.fieldname === "signature") targetFolder = "staff/signatures";

    return {
      folder: targetFolder,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
      resource_type: "image",
    };
  },
});

const upload2 = multer({
  storage,
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"));
    }
    cb(null, true);
  },
});

export { cloudinary };
export default upload2;