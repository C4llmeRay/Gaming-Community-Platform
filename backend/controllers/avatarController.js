const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file received" });
    }

    console.log("Received Avatar File:", req.file);

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "avatars",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      const { buffer } = req.file;
      const readableStream = new Readable();
      readableStream.push(buffer);
      readableStream.push(null);

      readableStream.pipe(stream);
    });

    console.log("Cloudinary Upload Result:", result);

    const { secure_url: imageUrl, public_id: cloudinaryPublicId } = result;

    const newImage = new Image({
      fileName: req.file.originalname,
      cloudinaryPublicId,
      imageUrl,
    });

    await newImage.save();

    console.log("Image Information Saved to Database:", newImage);

    // Pass the image information to the next middleware or send it in the response
    req.image = {
      fileName: req.file.originalname,
      cloudinaryPublicId,
      imageUrl,
    };

    console.log("Image Information in Request:", req.image);

    next();
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({ message: "Error uploading avatar" });
  }
};

module.exports = { uploadAvatar };
