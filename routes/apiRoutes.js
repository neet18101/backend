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
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/gallery"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });
api_route.use(bodyParser.json({ limit: '100mb' }));
api_route.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
api_route.use('/galleryUpload', express.static('public/gallery'));

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
// api_route.post(
//   "/gallery",
//   upload.array("image", 5),
  
//   apiController.galleryApi
// );
api_route.post("/schedule", authenticateToken, apiController.scheduleApi);
api_route.post("/locality", authenticateToken, apiController.loacalityApi);
api_route.post('/upload', upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  // Process the uploaded files as needed

  res.send('Files uploaded!');
});
module.exports = api_route;
