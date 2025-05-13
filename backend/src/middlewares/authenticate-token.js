const jwt = require("jsonwebtoken");
const { ApiError } = require("../utils");
const { env } = require("../config");
const logger = require("../utils/logger");

const authenticateToken = (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  logger.debug(`Auth attempt: accessToken=${accessToken ? '[REDACTED]' : 'MISSING'}, refreshToken=${refreshToken ? '[REDACTED]' : 'MISSING'}`);

  if (!accessToken || !refreshToken) {
    logger.warn('Missing tokens in cookies');
    throw new ApiError(401, "Unauthorized. Please provide valid tokens.");
  }

  jwt.verify(accessToken, env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      logger.warn(`Invalid access token: ${err.message}`);
      throw new ApiError(
        401,
        "Unauthorized. Please provide valid access token."
      );
    }

    jwt.verify(
      refreshToken,
      env.JWT_REFRESH_TOKEN_SECRET,
      (err, refreshToken) => {
        if (err) {
          logger.warn(`Invalid refresh token: ${err.message}`);
          throw new ApiError(
            401,
            "Unauthorized. Please provide valid refresh token."
          );
        }

        req.user = user;
        req.refreshToken = refreshToken;
        logger.debug(`Auth success for user: ${JSON.stringify(user)}`);
        next();
      }
    );
  });
};

module.exports = { authenticateToken };
