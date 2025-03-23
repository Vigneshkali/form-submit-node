require("dotenv").config({ path: __dirname + "/.env" }); // Load .env from backend/
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Serve the index.html from the root directory
app.use(express.static(path.join(__dirname, ".."))); 

const PORT = process.env.PORT || 3000;

// ✅ Default route → Serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html")); 
});

// ✅ Email Setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Handle form submission
app.post("/send-email", async (req, res) => {
    const { email, name, phone, subject, message } = req.body;

    const mailOptionsToAdmin = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New Contact Form Submission: ${subject}`,
        text: `You have a new message from ${name}.\n\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    const mailOptionsToUser = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Thank You for Contacting Us!",
        text: `Hello ${name},\n\nThank you for reaching out! We have received your message:\n\n"${message}"\n\nWe will get back to you soon!\n\nBest Regards,\nYour Company`,
    };

    try {
        await transporter.sendMail(mailOptionsToAdmin);
        await transporter.sendMail(mailOptionsToUser);
        res.json({ message: "✅ Emails sent successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "❌ Error sending emails", error });
    }
});

// ✅ Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
