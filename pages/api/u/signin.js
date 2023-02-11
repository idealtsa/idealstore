
import connectMongoose from "../../../utils/connectMongoose";
import { User } from "../../../model/index";
import nodemailer from "nodemailer";
import { setCookie } from 'cookies-next';
const signin = async (req, res) => {
    await connectMongoose();
    try {
      // Get user input
      const { email, password } = req.body;
      // Validate user input
      if (!(email && password)) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      // Validate if user exist in our database
      const userexist = await User.findOne({ email: email.toLowerCase() }).select("+password");
      if (!userexist) {
        return res.status(401).send({
          message: "Invalid Email or Password",
        });
      }
      
      const isPasswordMatched = await userexist.comparePassword(password);
      if(!isPasswordMatched) {
        return res.status(401).send({
            message: "Invalid Email or Password",
          });
      }
  
      const protocol =req.headers["x-forwarded-proto"] || req.connection.encrypted
      ? "https"
      : "http";
  
    const url = new URL(`${protocol}://${req.headers.host}/`);
        // Create token
        const token =userexist.getJWTToken();
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
                    <a class="px-2 py-2 btn btn-primary text-blue-200 bg-blue-600 rounded" href="${url}user/verify/${userexist._id}/${token}">Click to Verify Email</a>
                    <p class="mt-4 text-sm">If you’re having trouble clicking the "Verify Email Address" button, copy
                        and
                        paste
                        the URL below
                        into your web browser:
                        <a href="${url}user/verify/${userexist._id}/${token}" class="text-blue-600 underline">${url}user/verify/${userexist._id}/${token}</a>
                    </p>
                </div>
            </div>
        </div>
          `;
  
        const textOutput = `
          'Hello ${userexist.name} , 
          Please verify your account by clicking the link:
          ${url}user/verify/${userexist._id}/${token}
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
  
      if (userexist) {
    
        const options = {
            expires: new Date(
              Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
          };
          setCookie("token", token, { req, res,options });
        return res.status(200).json(userexist);
      }
      return res
        .status(400)
        .json({ message: "Invalid Credentials or Forget Password!" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  };
  
  export default signin;