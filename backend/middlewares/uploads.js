import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "mern_uploads",
    resource_type: "auto",
    allowed_formats: ["jpg", "png", "jpeg", "mp4", "pdf"],
  },
});

const upload = multer({ storage });

export default upload;