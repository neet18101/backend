const express = require("express");
const cors = require("cors");
const api_route = express();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const verifyToken = require("../middleware/userAuth");
const jwt = require("jsonwebtoken");
const secretKey = "hello6g7yg678g8y"; // Replace with a strong secret in production
api_route.use(cors());
api_route.use(bodyParser.json());
api_route.use(bodyParser.urlencoded({ extended: true }));
const apiController = require("../controller/ApiController");
const authenticateToken = require("../middleware/authenticateToken");
//============ API Routes User========================//
// image store
const fileStorage = multer.diskStorage({
  destination: "PropertyImage",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});
const uploadImage = multer({
  storage: fileStorage,
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Please upload an Image file!"));
    }
    cb(undefined, true);
  },
});
api_route.use(bodyParser.json({ limit: "100mb" }));
api_route.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
api_route.use("/galleryUpload", express.static("public/gallery"));

api_route.get("/token", (req, res) => {
  const userData = {
    email: "navneet",
  };
  jwt.sign({ ...userData }, secretKey, { expiresIn: "360d" }, (err, token) => {
    if (err) {
      return res.status(500).json({ error: "Internal Server Error" });
    }
    res.json({ token });
  });
});
api_route.post("/register", authenticateToken, apiController.signupUser);
api_route.post("/login", authenticateToken, apiController.user_loin);
api_route.post("/property", authenticateToken, apiController.listProperty);
api_route.post("/amenities", authenticateToken, apiController.amentiesApi);
api_route.post("/rental", authenticateToken, apiController.rentalApi);
api_route.post(
  "/gallery",
  uploadImage.array("images", 4),
  apiController.galleryApi
);
api_route.post("/schedule", authenticateToken, apiController.scheduleApi);
api_route.post("/locality", authenticateToken, apiController.loacalityApi);
api_route.get("/userInfo", authenticateToken, apiController.userInfoById);

module.exports = api_route;
