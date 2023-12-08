const jwt = require("jsonwebtoken");
const UnAuthenticated = require("../errors/unauthenticated");

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  try {
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      throw new UnAuthenticated("wrong authentication token");
    }

    const token = authHeader.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    req.user = { _id: decoded._id };
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAuthenticated;
