const express = require("express");
const cors = require("cors");
const admin_routes = express();
const config = require("../config/config");
const multer = require("multer");
const path = require("path");
var session = require("express-session");
var flush = require("connect-flash");
// session use
admin_routes.use(
  session({
    secret: config.session_secret,
    resave: true,
    saveUninitialized: true,
  })
);
// middileware
const auth = require("../middleware/auth");
// image store
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/assets/room"));
  },
  filename: function (req, file, cb) {
    const name = Date.now() + "-" + file.originalname;
    cb(null, name);
  },
});
const upload = multer({ storage: storage });
// view engine set
admin_routes.use("/", express.static("public"));
admin_routes.set("view engine", "ejs");
admin_routes.set("views", "./view");
// flush messgae
admin_routes.use(
  session({
    secret: process.env.SESSION_SECERT,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
admin_routes.use(flush());
const bodyParser = require("body-parser");
admin_routes.use(cors());
admin_routes.use(bodyParser.json());
admin_routes.use(bodyParser.urlencoded({ extended: true }));
const adminController = require("../controller/AdminController");
// <==========Login Route GET POST=========================>
admin_routes.get("/", auth.isLogout, adminController.login);
admin_routes.get("/logout", auth.isLogin, adminController.logout);
admin_routes.post("/post-login", adminController.postLogin);
admin_routes.get("/dashboard", adminController.dashboard);
// <==========CRUD Route for user =========================>
admin_routes.get("/all-user", adminController.getUser);
module.exports = admin_routes;
