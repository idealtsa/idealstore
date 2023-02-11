import nodemailer from "nodemailer";

export default async (req, res) => {
    switch (req.method) {
      case "POST":
        await sendMailer(req, res);
        break;
  };}
const sendMailer = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    secure: true, // true for 465, false for other ports
    port: 465,
    auth: {
      user: process.env.ZohoUser,
      pass: process.env.ZohoPass
    },
  });
  const output = `
<p>You have a new contact request</p>
<h3>Contact Details</h3>
<ul style="list-style: none;margin-left: 0;padding-left: 0;">  
  <li><strong>Full Name:</strong> ${req.body.fullName}</li>
  <li><strong>Email:</strong> ${req.body.email}</li>
  <li><strong>Cell No:</strong> ${req.body.tel}</li>
</ul>
<h3>Message</h3>
<p>${req.body.message}</p>
`;
  const mailOptions = {
    from: process.env.ZohoUser,
    to: process.env.ZohoUser,
    subject: req.body.subject,
    text: req.body.message,
    html: output, // html body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      res.status(502).send({ message: error });
    }
    // console.log("Message sent: %s", info.messageId);
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.status(200).send({ message: "Email successfully send " });
  });
};


