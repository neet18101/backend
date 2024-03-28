const path = require("path");
const ejs = require("ejs");
const adminModel = require("../model/adminModel");
const User = require("../model/userModel");
const College = require("../model/findnearbyModel");
const propertyDetails = require("../model/propertyDetails");
const gallery = require("../model/galleryModal");

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
    const pageType = "Dashboard";

    res.render("pages/dashboard", { user, isNewUser, pageType: pageType });
  } catch (error) {
    console.log(error.message);
  }
};
// get all User

const getUser = async (req, res, next) => {
  try {
    const user = await User.find({ is_active: 1 });
    const pageType = "User list";
    const isNewUser = user.some(
      (u) => new Date(u.date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    );
    res.render("pages/user", { user, isNewUser, pageType });
  } catch (error) {
    console.log(error.message);
  }
};

// <========================Function for CRUD add college and unviersity=========================>
const addCollege = async (req, res, next) => {
  try {
    const pageType = "Find Near By College";
    const getAllUniversity = await College.find({ is_active: true });
    res.render("pages/add_college", {
      pageType: pageType,
      data: getAllUniversity,
    });
  } catch (error) {
    console.log(error.message);
  }
};

const postAddCollege = async (req, res, next) => {
  try {
    const { name, location } = req.body;
    let image = "/uploads/default.jpg"; // Default image path

    if (req.file) {
      image = "/assets/" + req.file.filename;
    }

    const newCollege = new College({ name, location, image });
    await newCollege.save();

    res.redirect("/add-college"); // Redirect to a colleges listing page or any other page
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
};

// <========================Function for CRUD Show property=========================>
const showProperty = async (req, res, next) => {
  try {
    const pageType = "Show All Property";
    const data = await propertyDetails.aggregate([
      {
        $match: { is_active: 1 }, // Match condition for propertydetails
      },
      {
        $lookup: {
          from: "gallerymodals", // Collection name for the gallery collection
          localField: "user_id",
          foreignField: "user_id",
          as: "galleryData",
        },
      },
      {
        $project: {
          _id: 0, // Exclude _id field if not needed
          user_id: 1, // Include user_id field from propertydetails
          propertyData: 1, // Include other fields from propertydetails if needed
          localityDetails: 1, // Include other fields from propertydetails if needed
          rentDetail: 1, // Include other fields from propertydetails if needed
          amenities: 1, // Include other fields from propertydetails if needed
          scheduleVisit: 1, // Include other fields from propertydetails if needed
          galleryData: {
            $map: {
              input: "$galleryData",
              as: "gallery",
              in: {
                gallery_name: "$$gallery",
                // Add other fields from gallerymodals if needed
              },
            },
          },
        },
      },
    ]);

    console.log(data);

    res.render("pages/show_property", { pageType: pageType, data });
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
  addCollege,
  postAddCollege,
  showProperty,
};
