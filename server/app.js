const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const creds = require('./config.js');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.post('/send', (req, res) => {
  const { email, image } = req.body;
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: creds.USER,
      pass: creds.PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  //Setup email template
  const mailOptions = {
    from: creds.USER,
    to: email,
    subject: 'A Postcard For You!',
    html: '<b>Congratulations</b>',
    attachments: { path: image },
  };
  //send email and return a corresponding message
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      res.status(200).json({ message: 'Your postcard was not sent. Please try again.' });
      return;
    }
    res.status(200).json({ message: 'Your postcard was sent!' });
  });
});

// const PORT = process.env.PORT || 3001;

// app.listen(PORT, () => {
//   console.log(`App listening on port ${PORT}!`);
// });
let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port);
