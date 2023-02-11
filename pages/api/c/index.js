import connectMongoose from "../../../utils/connectMongoose.js";
import { Categories } from "../../../model/index";

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await addCategory(req, res);
      break;
    case "GET":
      await getAllCategories(req, res);
      break;
  }
};
const addCategory = async (req, res) => {
  try {
    // Get Category input
    const { categoryName, categoryType, id } = req.body;
    // Validate user input
    if (!categoryName) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    // check if CategoriesName already exist
    const oldCategories = await Categories.findOne({ categoryName });
    if (oldCategories) {
      return res.status(409).json({
        message: "Category Name Already Exist. Please change Name of Category",
      });
    } else {
      // Create Categories  in our database
      // find the maximum id
      const data = await Categories.find().sort({ id: -1 }).limit(1);
      let CategoriesData = [];
      if (!id) {
        if (categoryType) {
          if (data.length !== 0)
            CategoriesData = await Categories.create({
              categoryName,
              categoryType,
              id: data[0].id + 1, // insert next id
            });
          else
            CategoriesData = await Categories.create({
              categoryName,
              categoryType,
              id: 1,
            });
        } else {
          if (data.length !== 0)
            CategoriesData = await Categories.create({
              categoryName,
              id: data[0].id + 1, // insert next id
            });
          else
            CategoriesData = await Categories.create({ categoryName, id: 1 });
        }
      } else {
        if (categoryType) {
            CategoriesData = await Categories.create({
              categoryName,
              categoryType,
              id,
            });
    
        } else { 
          CategoriesData = await Categories.create({ categoryName, id });
        }
      }

      return res.status(200).json({data:CategoriesData});
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const getAllCategories = async (req, res) => {
  try {
    const getCategories = await Categories.find();
    return res.status(200).json({data:getCategories});
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
