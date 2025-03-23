const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "vsrvsrvit@gmail.com",
    pass: "dkhzzgjrxlgeyfpu",
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"vsrvsrvit@gmail.com 👻" <vsrvsrvit@gmail.com>',
    to: "rajalingam2512000@gmail.com", 
    subject: "Hello ✔", 
        text: "Hello world?", 
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent: %s", info.messageId);
}

main().catch(console.error);