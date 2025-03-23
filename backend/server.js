const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "vsrvsrvit@gmail.com", // Your email directly
        pass: "dkhzzgjrxlgeyfpu", // Your app password directly
    },
});

app.post("/send-email", async (req, res) => {
    const { email, name, phone, subject, message } = req.body;

    // Email to Admin (Receiver)
    const mailOptionsToAdmin = {
        from: "vsrvsrvit@gmail.com",
        to: "vsrvsrvit@gmail.com", // Sending to yourself
        subject: `New Inquiry from ${name} - ${subject}`,
        text: `🔹 Name: ${name}\n🔹 Email: ${email}\n🔹 Phone: ${phone}\n🔹 Subject: ${subject}\n🔹 Message:\n\n${message}`,
    };

    // Confirmation Email to Sender (User)
    const mailOptionsToUser = {
        from: "vsrvsrvit@gmail.com",
        to: email, // Sending to user
        subject: `Your Message to Us: ${subject}`,
        text: `Hello ${name},\n\nThank you for contacting us! Here’s a copy of your message:\n\n"${message}"\n\n📞 We will get back to you soon.\n\nBest Regards,\nYour Company`,
    };

    try {
        await transporter.sendMail(mailOptionsToAdmin); // Send to Admin
        await transporter.sendMail(mailOptionsToUser); // Send to User

        res.json({ message: "Emails sent successfully to both sender and receiver!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error sending emails", error });
    }
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
