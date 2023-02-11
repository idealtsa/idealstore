import connectMongoose from "../../../../utils/connectMongoose.js";
import { Product } from "../../../../model/index";

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      break;
    case "GET":
      await getProductReviews(req, res);
      break;
  }
};

const getProductReviews = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await Product.findOne({ id }, "reviews").populate(
      "reviews.user",
      "name avatar.url"
    );

    let star = [];
    product.reviews.filter((review) => {
      star.push(review.rating);
    });
    let NoOfStar = 0;
    let NoOfEachStar = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    star.forEach((data, value) => {
      NoOfStar++;
      switch (data) {
        case 5:
          NoOfEachStar["5"]++;
          break;
        case 4:
          NoOfEachStar["4"]++;
          break;
        case 3:
          NoOfEachStar["3"]++;
          break;
        case 2:
          NoOfEachStar["2"]++;
          break;
        case 1:
          NoOfEachStar["1"]++;
          break;
        default:
          break;
      }
    }); //{ '1': 0, '2': 4, '3': 3, '4': 0, '5': 4 }

    if (!product) {
      return res.status(404).json({ message: "Product Not Found" });
    }

    res.status(200).json({
      success: true,
      NoOfEachStar,
      NoOfStar,
      reviews: product.reviews ? product.reviews : [],
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

