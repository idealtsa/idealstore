import connectMongoose from "../../../utils/connectMongoose";
import { Product, User } from "../../../model/index";
export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await addProduct(req, res);
      break;
    case "GET":
      await getAllProducts(req, res);
      break;
  }
};

const getAllProducts = async (req, res) => {
  try {
    const getProducts = await Product.find();
    const TotalProducts = await Product.count({});
    return res.status(200).json({ TotalProducts, data: getProducts });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const addProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      highlights,
      specifications,
      price,
      cuttedPrice,
      images,
      brand,
      category,
      user,
      warranty,
      stock,
    } = req.body;

    if (
      !(
        name ||
        description ||
        highlights ||
        specifications ||
        price ||
        cuttedPrice ||
        images ||
        brand ||
        category ||
        user
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Some Input is Missing" });
    }
    // Validate if user exist in our database
    const userexist = await User.findOne({ _id: user });
    if (!userexist) {
      return res.status(401).send({
        success: false,
        message: "InValid User",
      });
    }
    const data = await Product.find().sort({ id: -1 }).limit(1);
    const product = await Product.create({
      name,
      description,
      highlights,
      specifications,
      price,
      cuttedPrice,
      images,
      brand,
      category,
      user,
      warranty,
      stock,
      id: data.length !== 0 ? data[0].id + 1 : 1, // insert next id
    });

    return res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: `Sorry Something Happened! ${error.message}`,
    });
  }
};
