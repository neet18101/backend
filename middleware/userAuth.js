const jwt = require("jsonwebtoken");

const userAuth = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    return res.status(400).send({ success: false, msg: "token not found" });
  }
};

module.exports = userAuth;
