import connectMongoose from "@/lib/connectMongoose";
import { Categories } from "@/models";


export default Index= async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await updateOrder(req, res);
      break;
    case "GET":
      await getSingleOrderDetails(req, res);
      break;
      case "DELETE":
      await deleteOrder(req, res);
      break;
  }
};

const getSingleOrderDetails = async (req, res) => {
  try {
    const getCategories = await Categories.find();
    return res.status(200).json({data:getCategories});
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
const updateOrder= async (req, res) => {
  try {
    const { id } = req.query;
    const dataToDelete = await User.deleteOne({ _id: id });
    res.status(200).json({ success: true, data: dataToDelete });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteOrder = async (req, res) => {
  try {
    // Get user input
    const { id } = req.query;

    // Validate if user exist in our database
    const oldUser = await User.findOne({ _id: id });
    if (!oldUser) {
      return res.status(409).json({ message: "User Not Exist" });
    }

    // Create user update in database

    let filter = { _id: id };
    let update = req.body;

    let dataToSave = await User.findOneAndUpdate(filter, update, {
      new: true,
    });
    // Create token
    const token = dataToSave.getJWTToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    setCookie("token", token, { req, res, options });

    return res.status(201).json({
      success: true,
      data: dataToSave,
      token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};