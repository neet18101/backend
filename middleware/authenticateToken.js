const jwt = require("jsonwebtoken");

const secretKey = "hello6g7yg678g8y"; // Replace with a strong secret in production

const authenticateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== undefined) {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
  } else {
    return res.status(400).send({ success: false, msg: "token not found" });
  }
  jwt.verify(req.token, process.env.SECERT_JWT_TOKEN, (err, authData) => {
    if (err) {
      return res.status(403).json({
        error: "Forbidden",

        message: "Invalid token or token expired",
      });
    }
    next();
  });
};

module.exports = authenticateToken;
