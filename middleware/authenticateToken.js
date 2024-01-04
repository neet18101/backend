const jwt = require("jsonwebtoken");

const secretKey = "hello6g7yg678g8y"; // Replace with a strong secret in production

const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization").split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Missing token in the request header",
    });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({
        error: "Forbidden",
        message: "Invalid token or token expired",
      });
    }

    req.user = user; // Attach the user data to the request object if needed
    next();
  });
};

module.exports = authenticateToken;
