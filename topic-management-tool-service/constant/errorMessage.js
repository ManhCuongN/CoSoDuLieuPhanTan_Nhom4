const { HTTP_UNAUTHORIZED, HTTP_ERROR } = require("./httpRequest");
const UNAUTHORIZED_MESSAGE = {
  message: "unauthorized",
  status: HTTP_UNAUTHORIZED,
};

const EXPIRED_TOKEN_MESSAGE = {
  message: "your token has expired",
  status: HTTP_ERROR,
};

const OVER_REGISTER_MESSAGE = {
  message: "The topic reached limit request",
  status: HTTP_ERROR,
};

module.exports = {
  UNAUTHORIZED_MESSAGE,
  EXPIRED_TOKEN_MESSAGE,
  OVER_REGISTER_MESSAGE,
};
