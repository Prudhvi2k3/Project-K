const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'khub.helpdesk@gmail.com', // replace with your email
      pass: 'qlhm bduh lzjo vuzb', // replace with your email password
    },
});
  
router.post('/send', (req, res) => {
    const { name, email, subject, message, phone } = req.body; // Added phone to destructuring

    const mailOptions = {
        from: email,
        to: 'khub.kiet@gmail.com', // replace with the email you want to receive the form data
        subject: subject,
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`, // Added phone to the email body
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).json({ message: 'Email sent: ' + info.response });
    });
});

module.exports = router;