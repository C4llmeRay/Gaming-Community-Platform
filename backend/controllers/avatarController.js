const Image = require("../models/Image");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No avatar file received" });
    }

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

    const { secure_url: imageUrl, public_id: cloudinaryPublicId } = result;

    // Return the image URL in the response
    res.json({ imageUrl });
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return res.status(500).json({ message: "Error uploading avatar" });
  }
};

module.exports = { uploadAvatar };
