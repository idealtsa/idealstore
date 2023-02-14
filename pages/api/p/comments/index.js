import connectMongoose from "@/lib/connectMongoose";
import {Product, User  } from "@/models";

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await createProductComments(req, res);
      break;
    case "GET":
      break;
  }
};
const createProductComments = async (req, res) => {
  try {
    const { childId, comment, userId, productId } = req.body;
    let product = await Product.findOne({ id: productId });

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    } else {
      if (product.comments.length>0) {
        const maxId = Math.max(...product.comments.map((o) => o.id));
        if (childId) {
          product.comments.push({
            user: userId,
            comment,
            childId,
            id: maxId + 1,
          });
        } else {
          product.comments.push({
            user: userId,
            comment,
            childId: null,
            id: maxId + 1,
          });
        }
      } else {
        if (childId) {
          product.comments.push({ user: userId, comment, childId, id: 1 });
        } else {
          
          product.comments.push({
            user: userId,
            comment,
            childId: null,
            id: 1,
          });
        }
      }
    }
    await product.save({ validateBeforeSave: false });
    const productdata = await Product.findOne({ id: productId }).populate('comments.user','name avatar.url')

    res.status(200).json({
      success: true,
      comments: productdata.comments?productdata.comments:[]
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
