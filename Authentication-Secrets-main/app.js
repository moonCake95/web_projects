require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const ejs = require('ejs');

const app = express();
let log = console.log;



app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

const User = new mongoose.model('User', userSchema);


app.route('/')
  .get((req, res) => {
    res.render('home');
  });

app.route('/login')
  .get((req, res) => {
    res.render('login');
  })

  .post((req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          if (foundUser.password === password) {
            res.render('secrets');
          }
        }
      } else {
        log(err);
      }
    });
  });

app.route('/register')
  .get((req, res) => {
    res.render('register');
  })

  .post((req, res) => {
    const newUser = new User({
      email: req.body.username,
      password: req.body.password
    });

    newUser.save((err) => {
      if (!err) {
        res.render('secrets');
      } else {
        log(err);
      }
    });
  });







app.listen(3000, () => {
  log('Server Running On Port 3000.');
});
