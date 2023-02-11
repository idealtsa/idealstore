import { v2 as cloudinary } from "cloudinary";
import nextConnect from "next-connect";
import multer from "multer";
import DataURIParser from "datauri/parser";
import nodemailer from "nodemailer";
import { setCookie } from "cookies-next";
import connectMongoose from "@/lib/connectMongoose";
import { User } from "@/models";
// Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const options = {
  resource_type: "image",
  use_filename: true,
  folder: "tarabs/",
  unique_filename: false,
};

const memoryStorage = multer.memoryStorage();
const upload = multer({
  storage: memoryStorage,
});

const uploadToCloudinary = async (fileString, format) => {
  try {
    const { uploader } = cloudinary;
    const res = await uploader.upload(
      `data:image/${format};base64,${fileString}`,
      options
    );
    return res;
  } catch (error) {
    res
      .status(501)
      .json({ message: `Sorry something Happened! ${error.message}` });
  }
};
const parser = new DataURIParser();
const bufferToDataURI = (fileFormat, buffer) =>
  parser.format(fileFormat, buffer);

const signup = nextConnect({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ message: "Page is not found" });
  },
})
  .use(upload.single("avatar"))
  .post(async (req, res) => {
    await connectMongoose();
    try {
      const { file } = req;
      if (!file) res.status(400).json({ error: `File is Missing!` });
      const fileFormat = file.mimetype.split("/")[1];
      const { base64 } = bufferToDataURI(fileFormat, file.buffer);
      const imageDetails = await uploadToCloudinary(base64, fileFormat);
      addUser({req, res,imageDetails})
    } catch (error) {
      res
        .status(501)
        .json({ message: `Sorry Something Happened! ${error.message}` });
    }
  });
  
export const addUser = async ({req, res,imageDetails}) => {
    try {
      const { name, gender, email, cellno, password } = req.body;
      // Validate user input
      if (!(name && gender && email && cellno && password)) {
        return res.status(400).json({ message: "All inputs are required" });
      }
      // check if user already exist
      // Validate if user exist in our database
      const oldUser = await User.findOne({ email: email.toLowerCase() });
      if (oldUser) {
        return res
          .status(409)
          .json({ message: "User Already Exist. Please Login" });
      }
  
      // Create user in our database
  
      const data = await User.find().sort({ id: -1 }).limit(1);
      const dataToSave = await User.create({
        id: data.length !== 0 ? data[0].id + 1 : 1, // insert next id,
        name,
        cellno,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        gender,
        password,
        role: req.body.role ? req.body.role : "user",
        status: req.body.status ? req.body.status : "Pending",
        avatar: {
          public_id:imageDetails?imageDetails.public_id: process.env.User_Img_public_id,
          url: imageDetails?imageDetails.url:process.env.User_Img_url,
        },
      });
  
      const token = dataToSave.getJWTToken();
      const options = {
        expires: new Date(
          Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
      };
      if(imageDetails)sendEmail({ req, res, id:dataToSave._id })
      setCookie("token", token, { req, res, options });
      return res.status(201).json({
        success: true,
        data: dataToSave,
        token,
      });
    } catch (error) {
      res
        .status(501)
        .json({ message: `Sorry Something Happened! ${error.message}` });
    }
  };
  
export const sendEmail = ({ req, res, id }) => {
  const protocol =
    req.headers["x-forwarded-proto"] || req.connection.encrypted
      ? "https"
      : "http";

  const url = new URL(`${protocol}://${req.headers.host}/`);

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
          <p> Hello <strong>${req.body.name}</strong>,</p>
          <div class="flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-24 h-24 text-green-400" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                      d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
          </div>
  
          <p>We're happy you're here. Let's get your email address verified:</p>
          <div class="mt-4">
              <a class="px-2 py-2 btn btn-primary text-blue-200 bg-blue-600 rounded" href="${url}u/${id}">Click to Verify Email</a>
              <p class="mt-4 text-sm">If you’re having trouble clicking the "Verify Email Address" button, copy
                  and
                  paste
                  the URL below
                  into your web browser:
                  <a href="${url}u/${id}" class="text-blue-600 underline">${url}u/${id}</a>
              </p>
          </div>
      </div>
  </div>
    `;
  const textOutput = `
    'Hello ${req.body.name} , 
    Please verify your account by clicking the link:
    ${url}u/${id}
    `;
  const mailOptions = {
    from: `"Ideal Training  Science Academy" <admin@idealtsa.com>`,
    to: req.body.email,
    subject: "Account Verification Link",
    text: textOutput,
    html: htmlOutput, // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      // console.log('errrr',error)
      return res.status(400).json({ message: error });
    }
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  });
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default signup;
