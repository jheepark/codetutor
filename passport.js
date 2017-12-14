let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let FacebookStrategy = require('passport-facebook').Strategy;

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
  }, function(err, user) {
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

passport.use(new FacebookStrategy({
  clientID: process.env.CODETUTOR_FACEBOOK_APPID,
  clientSecret: process.env.CODETUTOR_FACEBOOK,
  callbackURL: 'https://code-tutor.herokuapp.com/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'email']
},
  // find in the database any profile that we have to match with the facebookId. If it finds the user,it returns the user to the front page.
  function(token, refreshToken, profile, done) {
    User.findOne({'facebookId': profile.id}, function(err, user) {
      if (err) return done(err);

      if (user) {
        return done(null, user);
        // otherwise it will look for the email, and if it can find that user, it will match it with the facebookId to that profile and then it will save that user.
      } else {
        User.findOne({email: profile.emails[0].value}, function (err, user) {
          if (user) {
            user.facebookId = profile.id
            return user.save(function (err) {
              if (err) return done(null, false, { message: "Can't save user info"});
              return done(null, user);
            })
          }
          //if cant find the above user, it creates a new one.
          var user = new User();
            user.name = profile.displayName;
            user.email = profile.emails[0].value;
            user.facebookId = profile.id
            user.save(function (err) {
              if (err) return done(null, false, { message: "Can't save user info"});
              return done(null, user);
            });
          })
        }


      });
    }
  ));
