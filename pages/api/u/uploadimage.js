import { v2 as cloudinary } from "cloudinary";
import nextConnect from "next-connect";
import multer from "multer";
import DataURIParser from "datauri/parser";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const options = {
  resource_type: "image",
  use_filename: true,
  folder: "tarabs/",
  unique_filename: false,
};

const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
});

const uploadToCloudinary = async (fileString, format) => {
  try {
    const { uploader } = cloudinary;
    const res = await uploader.upload(
      `data:image/${format};base64,${fileString}`,
      options
    );
    return res;
  } catch (error) {
    res
      .status(501)
      .json({ message: `Sorry something Happened! ${error.message}` });
  }
};
const parser = new DataURIParser();
const bufferToDataURI = (fileFormat, buffer) =>
  parser.format(fileFormat, buffer);

const uploadimage = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message:"Something broke!"});
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ message:"Page is not found"});
  },
})
  .use(upload.single("avatar"))
  .post(async (req, res) => {
    try {
      const { file } = req;
      if (!file) res.status(400).json({ error: `File is Missing!` });
      const fileFormat = file.mimetype.split("/")[1];
      const { base64 } = bufferToDataURI(fileFormat, file.buffer);
      const imageDetails = await uploadToCloudinary(base64, fileFormat);
      res.json({
        data: imageDetails,
      });
    } catch (error) {
      res
        .status(501)
        .json({ message: `Sorry Something Happened! ${error.message}` });
    }
  });

export const config = {
  api: {
    bodyParser: false,
  },
};
export default uploadimage;
