let express = require('express');
let router = express.Router();
let nodemailer = require('nodemailer');
let config = require('../config');
let transporter = nodemailer.createTransport(config.mailer)


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'CodeTutor - a platform for sharing code'});
});

router.get('/about', function(req, res, next) {
  res.render('about', {title: 'CodeTutor - a platform for sharing code'});
})

router.route('/contact').get(function(req, res, next) {
  res.render('contact', {title: 'CodeTutor - a platform for sharing code'});
}).post(function(req, res, next) {
  req.checkBody('name', 'Empty name field').notEmpty();
  req.checkBody('email', 'Invalid email').isEmail();
  req.checkBody('message', 'Empty message field').notEmpty();
  let errors = req.validationErrors();

  if (errors) {
    res.render('contact', {
      title: 'CodeTutor - a platform for sharing code',
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      errorMessages: errors
    });
  } else {
    let mailOptions = {
      from: 'CodeTutor <noreply@codetutor.com>',
      to: process.env["NODEMAILER_PROVIDER"],
      subject: 'You got a new message from visitor',
      text: req.body.message
    };
    transporter.sendMail(mailOptions, function(error, info){
      if(error) {
        return console.log(error);
      }
      res.render('thank', {title: 'CodeTutor - a platform for sharing code'});
    });
  }
})

module.exports = router;
