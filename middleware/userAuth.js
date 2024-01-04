const jwt = require("jsonwebtoken");
const key = "hellosir";
const verifyToken = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["authorized"];
  if (!token) {
    res
      .status(200)
      .send({ success: false, msg: "A Token Is Required Authenticate" });
  }
  try {
    const decode = jwt.verify(token, key);
    req.user = decode;
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
  return next();
};
module.exports = verifyToken;
