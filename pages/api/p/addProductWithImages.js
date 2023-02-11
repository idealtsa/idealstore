import { v2 as cloudinary } from "cloudinary";
import nextConnect from "next-connect";
import multer from "multer";
import DataURIParser from "datauri/parser";
import connectMongoose from "../../../utils/connectMongoose";
import { Product } from "../../../model/index";

// Config
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
      await addProductWithImages(req, res);
      break;
  }
};


const addProductWithImages = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ message: "Page is not found" });
  },
})
  .use(
    upload.fields([
      { name: "logo", maxCount: 1 },
      { name: "images", maxCount: 6 },
    ])
  )
  .post(async (req, res) => {
    await connectMongoose();
    try {
      const logo = req.files["logo"][0];
      if (!logo) res.status(400).json({ error: `Logo Image is Missing!` });
      const fileFormat = logo.mimetype.split("/")[1];
      const { base64 } = bufferToDataURI(fileFormat, logo.buffer);
      const logoDetails = await uploadToCloudinary(base64, fileFormat);
      const brandLogo = {
        public_id: logoDetails.public_id,
        url: logoDetails.secure_url,
      };
      const brand = {
        name: req.body.brandname,
        logo: brandLogo,
      };
      const images = req.files["images"];
      if (!images)
        res.status(400).json({ error: `Product Images are Missing!` });
      let imagesList = [];
      for (var i = 0; i < images.length; i++) {
        let fileFormat = images[i].mimetype.split("/")[1];
        let { base64 } = bufferToDataURI(fileFormat, images[i].buffer);
        let { public_id, url } = await uploadToCloudinary(base64, fileFormat);
        imagesList.push({ public_id, url });
      }
      const {
        name,
        description,
        highlights,
        specifications,
        price,
        cuttedPrice,
        category,
        userId,
      } = req.body;

      if (
        !(
          name ||
          description ||
          highlights ||
          specifications ||
          price ||
          cuttedPrice ||
          category ||
          userId
        )
      ) {
        return res.status(400).json({
          message: "All inputs are Required",
        });
      }
      const data = await Product.find().sort({ id: -1 }).limit(1);
      let product = [];
      if (data.length !== 0)
        product = await Product.create({
          name,
          description,
          highlights,
          specifications,
          price,
          cuttedPrice,
          images: imagesList,
          brand,
          category,
          user: userId,
          id: data[0].id + 1, // insert next id
        });
      else
        product = await Product.create({
          name,
          description,
          highlights,
          specifications,
          price,
          cuttedPrice,
          images: imagesList,
          brand,
          category,
          user: userId,
          id: 1,
        });

      res.status(201).json({
        success: true,
        product,
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
