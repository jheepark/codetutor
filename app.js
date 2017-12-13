let express = require('express');
let path = require('path');
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
let expressValidator = require('express-validator');

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
let passport = require('passport');
let session = require('express-session');

require('./passport');
let config = require('./config');

let indexRoute = require('./routes/index');
let authRoute = require('./routes/auth');

mongoose.connect(config.dbConnstring);
global.User = require('./models/user');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());
//configuration for session to get Passport working
app.use(session({
  secret: config.sessionKey,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
  if(req.isAuthenticated()){
    res.locals.user = req.user; //creating a session user
  }
  next();
})

app.use('/', indexRoute);
app.use('/', authRoute);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
