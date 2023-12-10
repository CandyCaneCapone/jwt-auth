const jwt = require("jsonwebtoken");
const UnAuthenticated = require("../errors/unauthenticated");

const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    throw new UnAuthenticated("Please provide your token");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = { _id: decoded._id };
  }catch(error) {
    next(new UnAuthenticated("Please provide a valid token"))
  }
  next();
  
};

module.exports = isAuthenticated;
