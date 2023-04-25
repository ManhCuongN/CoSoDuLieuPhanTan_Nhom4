const {
  generateAccessToken,
  generateRefreshToken,
  decodedToken,
} = require("../jwt");
const {
  HTTP_OK_STATUS,
  HTTP_CREATED_STATUS,
} = require("../../constant/httpRequest");
const { EXPIRED_TOKEN_MESSAGE } = require("../../constant/errorMessage");

const googleAuthentication = (req, res, next) => {
  try {
    const { googleId } = req.user;
    const { isCreated } = req.user;
    const accessToken = generateAccessToken(googleId);
    console.log("access", accessToken);
    const refreshToken = generateRefreshToken(googleId);
    return res
      .status(isCreated ? HTTP_CREATED_STATUS : HTTP_OK_STATUS)
      .json({ access_token: accessToken, refresh_token: refreshToken });
  } catch (err) {
    next(err);
  }
};

const refreshAccessToken = (req, res, next) => {
  const { refresh_token } = req.body;
  if (refresh_token) {
    const payload = decodedToken(refresh_token);
    const currentTime = new Date().getTime();
    if (currentTime > payload.exp) {
      next(EXPIRED_TOKEN_MESSAGE);
    } else {
      const googleId = payload.sub;
      const accessToken = generateAccessToken(googleId);
      // const refreshToken = generateRefreshToken(googleId);
      // return res
      //   .status(HTTP_OK_STATUS)
      //   .json({ access_token: accessToken, refresh_token: refreshToken });

      return res.status(HTTP_OK_STATUS).json({ access_token: accessToken });
    }
  }
};

module.exports = {
  googleAuthentication,
  refreshAccessToken,
};
