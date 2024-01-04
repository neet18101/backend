const path = require("path");
const ejs = require("ejs");
const adminModel = require("../model/adminModel");
const User = require("../model/userModel");

// user login start
const login = async (req, res, next) => {
  try {
    res.render("pages/login", { message: req.flash("message") });
  } catch (error) {
    console.log(error.message);
  }
};

// logout
const logout = async (req, res) => {
  // Clear the user session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error");
    }
    return res.redirect("/");
  });
};

const postLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return req.flash("message", "All Fields Are Required"), res.redirect("/");
    }
    const adminData = await adminModel.findOne({ email: email });
    if (adminData) {
      // const passwordMatch = await bcrypt.compare(password, adminData.password);
      if (adminData.password === password) {
        res.setHeader("Content-Type", "text/html");
        req.session.user_id = adminData._id;
        res.redirect("/dashboard");
        next();
      } else {
        res.render("pages/login", {
          message: "pages email and password incorrect",
        });
      }
    } else {
      req.flash("message", "Invalid email or password");
      res.redirect("/");
    }
  } catch (error) {
    if (error?.code === 11000) {
      return res.json({
        status: "error",
        message: "Email already exists",
      });
    }
  }
};
// dashboard

const dashboard = async (req, res, next) => {
  try {
    const user = await User.find();
    const isNewUser = user.some(
      (u) => new Date(u.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );

    res.render("pages/dashboard", { user, isNewUser });
  } catch (error) {
    console.log(error.message);
  }
};
// get all User

const getUser = async (req, res, next) => {
  try {
    const user = await User.find({ is_active: 1 });
    const isNewUser = user.some(
      (u) => new Date(u.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    res.render("pages/user", { user, isNewUser });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports = {
  login,
  dashboard,
  postLogin,
  logout,
  getUser,
};
