import connectMongoose from "@/lib/connectMongoose";
import { Categories } from "@/models";

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await updateCategoryById(req, res);
      break;
    case "GET":
      await getAllCategoryById(req, res);
      break;
  }
};
const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.query;
    // Get Category input
    const { categoryName, categoryType } = req.body;
    // Validate user input
    if (!categoryName) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    // check if Category id not exist
    const existCategoryId = await Categories.findOne({ id });
    if (!existCategoryId) {
      return res.status(409).json({
        message: "Category Id not Exist in Database",
      });
    }
    // check if Categories Name already exist
    const oldCategories = await Categories.findOne({ categoryName });
    if (oldCategories) {
      return res.status(409).json({
        message: "Category Name Already Exist. Please change Name of Category",
      });
    } else {
      // Create Categories  in our database
      let CategoriesData = [];
      if (categoryType) {
        CategoriesData = await Categories.findOneAndUpdate(
          id,
          { categoryName, categoryType },
          { new: true }
        );
      } else {
        CategoriesData = await Categories.findOneAndUpdate(
          id,
          { categoryName },
          { new: true }
        );
      }
      return res.status(200).json({ data: CategoriesData });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const getAllCategoryById = async (req, res) => {
  try {
    const { id } = req.query;
    const getCategories = await Categories.findOne({ id });
    return res.status(200).json({ data: getCategories });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
