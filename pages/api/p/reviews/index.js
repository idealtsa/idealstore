import connectMongoose from "@/lib/connectMongoose";
import {Product,  Categories } from "@/models";

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await createProductReview(req, res);
      break;
    case "GET":
      break;
  }
};
const createProductReview = async (req, res) => {
  try {
    const { rating, comment, userId, productId } = req.body;
    const review = {
      user: userId,
      rating: Number(rating),
      comment,
    };

    const product = await Product.findOne({ id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    const isReviewed = product.reviews.find(
      (review) => review.user.toString() === userId
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === userId)
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
