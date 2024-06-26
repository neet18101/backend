const express = require("express");
const cors = require("cors");
const api_route = express();
const session = require("express-session");
const config = require("../config/config");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");
const verifyToken = require("../middleware/userAuth");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const secretKey = "hello6g7yg678g8y"; // Replace with a strong secret in production
api_route.use(cors());
api_route.use(bodyParser.json());
api_route.use(bodyParser.urlencoded({ extended: true }));
const apiController = require("../controller/ApiController");
const authenticateToken = require("../middleware/authenticateToken");
const userAuth = require("../middleware/userAuth");
//============ API Routes User========================//
// image store
const fileStorage = multer.diskStorage({
  destination: "public/assets", // Corrected destination path
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// Custom function to check file type
const fileFilter = (req, file, cb) => {
  // Allow images and videos
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Please upload an Image or Video file!"), false);
  }
};
const uploadImage = multer({
  storage: fileStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit (adjust the value as needed)
  },
  fileFilter: fileFilter,
});

api_route.use(bodyParser.json({ limit: "100mb" }));
api_route.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
api_route.use("/", express.static("public"));
// api_route.use("/assets", express.static(__dirname + "/temp/uploads"));

// api_route.get("/token", (req, res) => {
//   const userData = {
//     email: "navneet",
//   };
//   jwt.sign({ ...userData }, secretKey, { expiresIn: "360d" }, (err, token) => {
//     if (err) {
//       return res.status(500).json({ error: "Internal Server Error" });
//     }
//     res.json({ token });
//   });
// });
api_route.post("/register", apiController.signupUser);
api_route.post("/login", apiController.user_loin);
api_route.post(
  "/property",
  uploadImage.array("gallery"),
  authenticateToken,
  apiController.listProperty
);

// <========================= PGlist  API ========================>
api_route.post("/add-pg", authenticateToken, apiController.pglistApi);
// api_route.post("/amenities", authenticateToken, apiController.amentiesApi);
// api_route.post("/rental", authenticateToken, apiController.rentalApi);
api_route.post(
  "/gallery",
  uploadImage.array("images", 4),
  apiController.galleryApi
);
api_route.post(
  "/pg-gallery",
  uploadImage.array("images", 4),
  apiController.pg_list_gallery_api
);
// api_route.post("/schedule", authenticateToken, apiController.scheduleApi);
// api_route.post("/locality", authenticateToken, apiController.loacalityApi);
api_route.get("/userInfo", authenticateToken, apiController.userInfoById);
api_route.get("/owner-details", authenticateToken, apiController.ownerDetails);
api_route.get("/token-verify", userAuth, apiController.userTokenVerify);
// <========================= Hoome Page API ========================>
api_route.get("/home-page", apiController.homePageApi);
api_route.get("/search", authenticateToken, apiController.searchByLocationApi);

// <========================= Filter  API ========================>
api_route.get("/filter", authenticateToken, apiController.filterApi);

// <========================= productByUrl  API ========================>
api_route.get("/product/:url", apiController.productByUrlApi);
// <========================= propertyByOwnerId  API ========================>\
api_route.get("/property", authenticateToken, apiController.propertyByOwnerId);

// <========================= getOwnerDetails  API ========================>\
api_route.post(
  "/get-owner-details",
  authenticateToken,
  apiController.getOwnerDetails
);
api_route.get(
  "/all-requests",
  authenticateToken,
  apiController.user_all_requests
);

module.exports = api_route;
