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
      await updateProductById(req, res);
      break;
    case "GET":
      await getProductById(req, res);
      break;
    case "DELETE":
      await deleteProductById(req, res);
      break;
  }
};
const updateProductById = async (req, res) => {
  try {
    const { id } = req.query;
    // Get all inputs are
    const {
      categoryId,
      name,
      src,
      oldPrice,
      price,
      rating,
      maxQuantity,
      description,
      isStock,
    } = req.body;

    // Check all inputs are
    if (
      !(
        categoryId ||
        name ||
        src ||
        oldPrice ||
        price ||
        rating ||
        maxQuantity ||
        description ||
        isStock
      )
    ) {
      return res.status(400).json({
        message: "All inputs are Required",
      });
    }
    // Check if Product is not  exist
    const ProductExist = await Product.findOne({ id });
    if (!ProductExist) {
      return res.status(409).json({
        message: "Product is not exist.",
      });
    }
    // Check if Category is not  exist
    const categoryExist = await Categories.findOne({ id: categoryId });
    if (!categoryExist) {
      return res.status(409).json({
        message: "Category is not exist.",
      });
    }

    // Create Product  in our database
    // find the maximum id
    const ProductData = await Product.findOneAndUpdate(
      id,
      {
        categoryId,
        name,
        src,
        oldPrice,
        price,
        rating,
        maxQuantity,
        description,
        isStock,
      },
      { new: true }
    );
    return res.status(200).json({ success: true, data: ProductData });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProductById = async (req, res) => {
  try {
    const { id } = req.query;
    const getProducts = await Product.findOne({ id });
    await cloudinary.uploader.destroy(getProducts.brand.logo.public_id);
    getProducts.images.map(async (img) => {
      await cloudinary.uploader.destroy(img.public_id);
    });
    const deleteProducts = await Product.deleteOne({ id });
    return res.status(200).json({
      success: true,
      data: deleteProducts,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const { id } = req.query;
    const getProducts = await Product.findOne({ id });
    return res.status(200).json({ success: true, data: getProducts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const config = {
  api: {
    bodyParser: false,
  },
};
