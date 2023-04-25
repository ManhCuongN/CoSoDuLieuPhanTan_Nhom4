const JWT = require("jsonwebtoken");

const generateAccessToken = (googleId) => {
  return JWT.sign(
    {
      aud: "student",
      iss: process.env.NAME,
      iat: new Date().getTime(),
      sub: googleId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "3h" }
  );
};

const generateRefreshToken = (googleId) => {
  return JWT.sign(
    {
      aud: "student",
      iss: process.env.NAME,
      iat: new Date().getTime(),
      sub: googleId,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "3d" }
  );
};

const decodedToken = (token) => {
  return JWT.verify(token, process.env.JWT_SECRET_KEY);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  decodedToken,
};
