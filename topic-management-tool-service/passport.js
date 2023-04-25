const passport = require("passport");
const GoogleStrategy = require("passport-token-google").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const { ROLE_STUDENT } = require("./constant/constant");
const { UNAUTHORIZED_MESSAGE } = require("./constant/errorMessage");
const User = require("./model/user");
const subjectQueueService = require("./service/subjectQueue");

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET_KEY,
    },
    async (payload, done) => {
      try {
        let user = null;
        if (payload.sub == "admin") {
          user = await User.findOne({
            googleId: "admin",
          });
        } else {
          user = await User.findOne({
            googleId: payload.sub,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_Secret,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let isCreated = false;
        let user = await User.findOne({
          googleId: profile.id,
        });
        if (!user) {
          const extension = profile._json.email.split("@")[1];
          const tdtu = extension.match("tdt") || extension.match("gmail") || extension.match("vku");
          if (tdtu == null) {
            throw UNAUTHORIZED_MESSAGE;
          }
          isCreated = true;
          user = new User({
            googleId: profile.id,
            familyName: profile.name.familyName,
            givenName: profile.name.givenName,
            email: profile._json.email,
            picture: profile._json.picture,
            createdAt: new Date(),
            role: ROLE_STUDENT,
          });
          await user.save();
          subjectQueueService.checkQueue(user.email, user._id);
        } else {
          if (user.picture != profile._json.picture) {
            user.picture = profile._json.picture;
            await user.save();
          }
        }

        done(null, { googleId: user.googleId, isCreated });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
