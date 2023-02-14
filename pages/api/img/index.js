import { v2 as cloudinary } from "cloudinary";
import nextConnect from "next-connect";
import multer from "multer";
import DataURIParser from "datauri/parser";
import connectMongoose from "@/lib/connectMongoose";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const options = {
  resource_type: "image",
  use_filename: true,
  folder: process.env.CLOUDINARY_FOLDER_PRODUCT_NAME,
  unique_filename: false,
};

const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
});
let maxCount=1;
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

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await addSingleImage(req, res)
      break;
    case "DELETE":
      await deleteSingleImage(req, res);
      break;
  }
};

const addSingleImage = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({success: false,message: "Something broke!" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ success: false,message: "Page is not found" });
  },
}).use(upload.fields([{ name: "image", maxCount:1}]))
  .post(async (req, res) => {
    await connectMongoose();
    try {
      const image = req.files["image"][0];
      if (!image) res.status(400).json({ success: false,message: `image Image is Missing!` });
      const fileFormat = image.mimetype.split("/")[1];
      const { base64 } = bufferToDataURI(fileFormat, image.buffer);
      const imageDetails = await uploadToCloudinary(base64, fileFormat);
     return  res.status(201).json({
        success: true,
        imageDetails,
      });
    } catch (error) {
      return res
        .status(501)
        .json({ success: false,message: `Sorry Something Happened! ${error.message}` });
    }
  });

const deleteSingleImage = async (req, res) => {
  try {
    const deleteImage = await cloudinary.uploader.destroy(req.query.public_id);
    return res.status(200).json({
      success: true,
      data: deleteImage
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
