const express = require("express");
var cors = require("cors");
var path = require("path");
const bodyParser = require("body-parser");
const { config } = require("dotenv");
var session = require("express-session");
var flush = require("connect-flash");
const htpp = require("http");
const app = express();
const PORT = 4000;
const server = htpp.createServer(app);
const { Server } = require("socket.io");
// Serving static files in Express
app.use(express.static(path.join(__dirname, "public")));

// const Product = require("./models/productModel");
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
config();

// Db connection

var dbconnection = require("./utlis/dbConnection");

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://chat-frontend-opal.vercel.app/"],
    methods: ["GET", "POST", "PUT"],
  },
  transports: ["websocket", "polling"],
  upgrade: false,
  pingInterval: 1000,
  pingTimeout: 150000,
});

// view engine set
app.set("view engine", "ejs");
app.set("views", "./views");
// flush messgae
app.use(
  session({
    secret: process.env.SESSION_SECERT,
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flush());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// For User Routes
const adminRoute = require("./routes/adminRoute");
app.use("/", adminRoute);

// //  Api Route
const apiRoute = require("./routes/apiRoutes");
app.use("/api/v1", apiRoute);

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});




server.listen(PORT || 5000, () => {
  console.log(`server start ${PORT || 5000}`);
});
