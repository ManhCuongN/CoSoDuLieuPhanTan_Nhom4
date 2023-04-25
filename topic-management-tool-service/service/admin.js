const {
  HTTP_OK_STATUS,
  HTTP_ERROR,
  HTTP_NOT_FOUND,
} = require("../constant/httpRequest");
const {
  generateAccessToken,
  generateRefreshToken,
  decodedToken,
} = require("./jwt");

const login = (req, res, next) => {
  const { admin_id } = req.body;
  if (admin_id && admin_id == process.env.ADMIN_SECRET) {
    try {
      const accessToken = generateAccessToken("admin");
      const refreshToken = generateRefreshToken("admin");
      console.log("login admin success");
      return res
        .status(HTTP_OK_STATUS)
        .json({ access_token: accessToken, refresh_token: refreshToken });
        
    } catch (err) {
      next(err);
    }
  } else {
    res.status(HTTP_NOT_FOUND).json();
  }
};

module.exports = {
  login,
};
