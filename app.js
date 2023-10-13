import express from 'express';
import path from 'path';
import nodemailer from 'nodemailer';
import dotenv from "dotenv"

dotenv.config()

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/pages/home/home.html'));
});

app.post('/send-email', async (req, res) => {
  const { to, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  try {
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>',
      to,
      subject,
      text: message,
      html: `<b>${message}</b>`,
    });
    res.send('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending email');
  }
});

const PORT = 8080;

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
