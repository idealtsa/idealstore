import bcrypt from "bcryptjs";
import { User } from "../../../model/index";
import connectMongoose from "../../../utils/connectMongoose.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { setCookie } from "cookies-next";

export default async (req, res) => {
  // Database connection
  await connectMongoose();
  switch (req.method) {
    case "POST":
      await signin(req, res);
      break;
    case "GET":
      await getUserById(req, res);
      break;
    case "PUT":
      await updateUserById(req, res);
      break;
    case "DELETE":
      await deleteUserById(req, res);
      break;
  }
};

const signin = async (req, res, next) => {
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      return res.status(400).json({ message: "All input is required" });
    }
    // Validate if user exist in our database
    const userexist = await user.findOne({ email: email.toLowerCase() });
    if (!userexist) {
      return res.status(401).send({
        message: "User is not exist!.Please Create New Account!",
      });
    }
    const url = new URL(`${req.protocol}://${req.get("host")}`);
    if (userexist.status != "Active") {
      const transporter = nodemailer.createTransport({
        host: "smtp.zoho.com",
        secure: true,
        port: 465,
        auth: {
          user: process.env.ZohoUser,
          pass: process.env.ZohoPass,
        },
      });
      const htmlOutput = `
          <div class="flex items-center justify-center min-h-screen p-5 bg-blue-100 min-w-screen">
          <div class="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
              <h3 class="text-2xl">Thanks for signing up for Ideal Training Academy</h3>
              <p> Hello <strong>${userexist.name}</strong>,</p>
              <div class="flex justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-green-400" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                          d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
              </div>
      
              <p>We're happy you're here. Let's get your email address verified:</p>
              <div class="mt-4">
                  <a class="px-2 py-2 btn btn-primary text-blue-200 bg-blue-600 rounded" href="${url}user/verify/${userexist._id}/${userexist.token}">Click to Verify Email</a>
                  <p class="mt-4 text-sm">If you’re having trouble clicking the "Verify Email Address" button, copy
                      and
                      paste
                      the URL below
                      into your web browser:
                      <a href="${url}user/verify/${userexist._id}/${userexist.token}" class="text-blue-600 underline">${url}user/verify/${userexist._id}/${userexist.token}</a>
                  </p>
              </div>
          </div>
      </div>
        `;

      const textOutput = `
        'Hello ${userexist.name} , 
        Please verify your account by clicking the link:
        ${url}user/verify/${userexist._id}/${userexist.token}
        `;

      const mailOptions = {
        from: `"IDEAL TRAINING SCIENCE ACADEMY" <admin@idealtsa.com>`,
        to: userexist.email,
        subject: "Account Verification Link",
        text: textOutput,
        html: htmlOutput, // html body
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          res.status(502).send({ message: error });
        }
        // console.log("Message sent: %s", info.messageId);
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        res
          .status(200)
          .send({ message: "Email successfully send for Verification " });
      });
      return res
        .status(401)
        .send({ message: "Pending Account. Please Verify Your Email!" });
    }

    if (userexist && (await bcrypt.compare(password, userexist.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: userexist._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "24h",
        }
      );
      // save user exist token
      userexist.token = token;
      // user exist
      return res.status(200).json(userexist);
    }
    return res
      .status(400)
      .json({ message: "Invalid Credentials or Forget Password!" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};
const getUserById = async (req, res) => {
  try {
    const { id } = req.query;
    const data = await User.findById(id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteUserById= async (req, res) => {
  try {
    const { id } = req.query;
    const dataToDelete = await User.deleteOne({ _id: id });
    res.status(200).json({ success: true, data: dataToDelete });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//Put Method for updateuser
const updateUserById = async (req, res) => {
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

//Post Method  for signup
const signup = async (req, res, next) => {
  try {
    // Get user input
    const { name, email, cellno, password } = req.body;
    // Validate user input
    if (!(email && password && name && cellno)) {
      return res.status(400).json({ message: "All input is required" });
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await user.findOne({ email });
    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User Already Exist. Please Login" });
    }
    //Encrypt user password
    let encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const dataToSave = await user.create({
      name,
      cellno,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    // Create token
    const token = jwt.sign(
      { user_id: dataToSave._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "24h",
      }
    );
    // save user token
    dataToSave.token = token;
    dataToSave.save();
    const url = new URL(`${req.protocol}://${req.get("host")}`);

    const id = dataToSave._id;

    // Send Verification mail
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.ZohoUser,
        pass: process.env.ZohoPass,
      },
    });
    const htmlOutput = `
        <div class="flex items-center justify-center min-h-screen p-5 bg-blue-100 min-w-screen">
        <div class="max-w-xl p-8 text-center text-gray-800 bg-white shadow-xl lg:max-w-3xl rounded-3xl lg:p-12">
            <h3 class="text-2xl">Thanks for signing up for Ideal Training Academy</h3>
            <p> Hello <strong>${name}</strong>,</p>
            <div class="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-green-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                </svg>
            </div>
    
            <p>We're happy you're here. Let's get your email address verified:</p>
            <div class="mt-4">
                <a class="px-2 py-2 btn btn-primary text-blue-200 bg-blue-600 rounded" href="${url}user/verify/${id}/${token}">Click to Verify Email</a>
                <p class="mt-4 text-sm">If you’re having trouble clicking the "Verify Email Address" button, copy
                    and
                    paste
                    the URL below
                    into your web browser:
                    <a href="${url}user/verify/${id}/${token}" class="text-blue-600 underline">${url}user/verify/${id}/${token}</a>
                </p>
            </div>
        </div>
    </div>
      `;
    const textOutput = `
      'Hello ${name} , 
      Please verify your account by clicking the link:
      ${url}user/verify/${id}/${token}
      `;
    const mailOptions = {
      from: `"Ideal Training Academy" <majid.qauiub@gmail.com>`,
      to: email,
      subject: "Account Verification Link",
      text: textOutput,
      html: htmlOutput, // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        // console.log('errrr',error)
        return res.status(400).json({ message: error });
      }
      //   console.log("Message sent: %s", info.messageId);
      //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

      return res.status(200).json(dataToSave);
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Post Method for verification email
const verificationEmail = async (req, res, next) => {
  try {
    // Get user input
    const id = req.params.id;
    const token = req.params.token;
    // Validate inputs
    if (!(id || token)) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    const userexist = await user.findById(id);
    if (userexist) {
      let filter = { _id: id, token };
      let update = { status: "Active" };
      let dataToSave = await user.findOneAndUpdate(filter, update, {
        new: true,
      });
      return res.status(200).redirect(process.env.WebSite + userexist.email);
    } else {
      return res.status(400).json({ message: "User is not exist" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
//Post Method for resetpassword
const resetpassword = async (req, res, next) => {
  try {
    // Get user input
    const id = req.params.id;
    const password = req.body.password;
    // Validate inputs
    if (!(id || password)) {
      return res.status(400).json({ message: "All inputs are required" });
    }
    const userexist = await user.findById(id);
    if (userexist) {
      let filter = { _id: id };
      //Encrypt user password
      let encryptedPassword = await bcrypt.hash(password, 10);
      let update = { password: encryptedPassword };
      let dataToSave = await user.findOneAndUpdate(filter, update, {
        new: true,
      });
      return res.status(200).json({ message: "Password update Successfully" });
    } else {
      return res.status(400).json({ message: "User is not exist" });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const forgettingpassword = async (req, res, next) => {
  try {
    // Get Required input
    const { email } = req.body;
    // Validate user input
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate if user exist in our database
    const userexist = await user.findOne({ email: email.toLowerCase() });
    if (!userexist) {
      return res.status(401).send({
        message: "User is not exist!.Please Create New Account!",
      });
    }
    if (userexist.status != "Active") {
      return res.status(401).send({
        message: "Pending Account. Please Verify Your Email!",
      });
    }
    // Send Verification mail
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      secure: true,
      port: 465,
      auth: {
        user: process.env.ZohoUser,
        pass: process.env.ZohoPass,
      },
    });
    const htmlOutput = `
      <p>Hi&nbsp;<strong>${userexist.name},</strong></p>
      <p>You requested to reset your password.</p>
      <p>Please, click the link below to reset your password</p>
      <p> <a href="${process.env.WebSite}resetpassword/${userexist._id}" class="text-blue-600 underline">${process.env.WebSite}resetpassword/${userexist._id}</a></p>
    `;
    const textOutput = `
    Hi ${userexist.name},\n
    You requested to reset your password.\n
    Please, click the link below to reset your password \n
    <a href="${process.env.WebSite}resetpassword/${userexist._id}" class="text-blue-600 underline">${process.env.WebSite}resetpassword/${userexist._id}</a>
 `;
    const mailOptions = {
      from: `"IDEAL TRAINING SCIENCE ACADEMY" <admin@idealtsa.com>`,
      to: userexist.email,
      subject: "Account Password Reset Request",
      text: textOutput,
      html: htmlOutput, // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(400).json({ message: error });
      }
      return res.status(200).json({ message: "Please Check Your Email!" });
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Post Method for verfytoken
const verfytoken = async (req, res, next) => {
  let token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    return res.status(200).json(decoded);
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

export {
  signup,
  signin,
  verificationEmail,
  forgettingpassword,
  resetpassword,
  updateUserById,
  deleteUserById,
  verfytoken,
  getUserById,
};
