const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      // Here you could save user info in DB
      // console.log("Google profile", profile);
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          // user exists
          done(null, user);
        } else {
          // create a new user
          const newUser = await User.create({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
          });
          return done(null, newUser);
        }
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
