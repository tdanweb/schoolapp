import Media from "../models/Media.js";


const uploadMedia = async (req, res) => {
  try {
    console.log("FILE:", req.file);

    const media = await Media.create({
      url: req.file.path,         // Cloudinary URL
      public_id: req.file.filename, // Cloudinary public_id
      fileType: req.file.mimetype,
      originalName: req.file.originalname,
    });

    res.status(201).json({
      message: "Upload successful",
      media,
    });

  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

export {uploadMedia}