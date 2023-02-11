import connectMongoose from "../../../utils/connectMongoose.js";
import { Categories, Order } from "../../../model/orderModel";

export default Index= async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await newOrder(req, res);
      break;
    case "GET":
      await getAllOrders(req, res);
      break;
  }
};
const newOrder = async (req, res) => {

  const {
      shippingInfo,
      orderItems,
      paymentInfo,
      totalPrice,
  } = req.body;

  const orderExist = await Order.findOne({ paymentInfo });

  if (orderExist) {
      return res.status(400).json({ message: "Order Already Placed" });
  }

  const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
  });

  // await sendEmail({
  //     email: req.user.email,
  //     templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
  //     data: {
  //         name: req.user.name,
  //         shippingInfo,
  //         orderItems,
  //         totalPrice,
  //         oid: order._id,
  //     }
  // });

  res.status(201).json({
      success: true,
      order,
  });
  
};

const getAllOrders = async (req, res) => {
  try {
    const getCategories = await Categories.find();
    return res.status(200).json({data:getCategories});
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};