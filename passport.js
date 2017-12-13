let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

//function to initialise the session when the user logins
passport.serializeUser(function(user, done) {
  done(null, user._id);
})
//accepts the session
passport.deserializeUser(function(id, done) {
  User.findOne({
    _id: id
  }, function(err, user) {
    done(err, user);
  })
});
//function that sets the username field - unique id based on email.
passport.use(new LocalStrategy({
  usernameField: 'email'
}, function(username, password, done) {
  User.findOne({
    email: username
  }, function(err, done) {
    if (err)
      return done(err);
    if (!user) {
      return done(null, false, {message: 'Incorrect username or password'});
    }
    if (!user.validPassword(password)) {
      return done(null, false, {message: 'Incorrect username or password'})
    }
    return done(null, user)
  })
}))
