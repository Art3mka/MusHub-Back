const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }
  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (err) {
    console.log(err);
    req.isAuth = false;
    next();
  }
  if (!decodedToken) {
    req.isAuth = false;
    next();
  }
  req.userId = decodedToken.userId;
  req.userRole = decodedToken.role;
  req.isAuth = true;
  next();
};
