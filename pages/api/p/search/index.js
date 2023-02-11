import connectMongoose from "../../../../utils/connectMongoose.js";
import { Product } from "../../../../model/index";

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "GET":
      await getSearchproducts(req, res);
      break;
  }
};

const getSearchproducts = async (req, res) => {
  try {
    const query = req.query;
    let { name, page, limit } = query;
    page = Math.max(0, page);
    const rgx = (pattern) => new RegExp(`.*${pattern}.*`);
    const searchRgx = rgx(name);

    const Products = await Product.find({
      name: { $regex: searchRgx, $options: "i" },
    })
      .limit(limit)
      .skip(limit * page)
      .sort({
        name: "asc",
      });

    return res.status(200).json({ data: Products });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
