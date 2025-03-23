require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000; // Use Render's assigned port

// Default route to check if the server is running
app.get("/", (req, res) => {
    res.send("✅ Server is running! Use /send-email to send an email.");
});

// Configure Nodemailer with environment variables
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Get email from .env
        pass: process.env.EMAIL_PASS, // Get password from .env
    },
});

app.post("/send-email", async (req, res) => {
    const { email, name, phone, subject, message } = req.body;

    const mailOptionsToAdmin = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER, // Admin's email
        subject: `New Contact Form Submission: ${subject}`,
        text: `You have a new message from ${name}.\n\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    const mailOptionsToUser = {
        from: process.env.EMAIL_USER,
        to: email, // User's email
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

// Start the server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
