import connectMongoose from "@/lib/connectMongoose";
import {Product, User  } from "@/models";
export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await updateProductComments(req, res);
      break;
      break;
    case "GET":
      await getProductComments(req, res);
      break;
  
  }
};

const updateProductComments = async (req, res) => {
  try {
    const { id } = req.query;
    const { commentId, userId,comment } = req.body;
    let product = [];
    product = await Product.findOne({ id }).select("comments");

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    let upatedComments=[]
if(comment){

  upatedComments = product.comments.filter(
    (cmt) =>
    cmt.comment=(cmt.id == commentId &&
        cmt.user.toString() === userId)?comment:cmt.comment
  );

}else{
    upatedComments = product.comments.filter(
      (comment) =>
        comment.id !== commentId &&
        comment.childId !== commentId &&
        comment.user.toString() === userId
    );
}
product = await Product.findOneAndUpdate(
  { id },
  {
    comments: upatedComments,
  },
  {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  }
).populate(
  "comments.user",
  "name avatar.url"
);
    res.status(200).json({
      success: true,
      comments: product.comments ? product.comments : [],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getProductComments = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await Product.findOne({ id }).populate(
      "comments.user",
      "name avatar.url"
    );
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json({
      success: true,
      comments: product.comments ? product.comments : [],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
