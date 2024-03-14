const path = require("path");
const ejs = require("ejs");
const userModel = require("../model/userModel");
const bcrypt = require("bcryptjs");
const CryptoJS = require("crypto-js");
const mailer = require("nodemailer");
const propertyDetails = require("../model/propertyDetails");
const nodemailer = require("nodemailer");
const { email, emailPassword } = require("../config/config");
const loacalityDetails = require("../model/localModel");

const amenties = require("../model/amenitiesModal");
const rental = require("../model/rentalDetails");
const gallery = require("../model/galleryModal");
const schedule = require("../model/scheduleModel");
const mongoose = require("mongoose");
const GalleryImage = require("../model/galleryModal");
const PropertyDetail = require("../model/propertyDetails");
const jwt = require("jsonwebtoken");

// Email
const sendResetPasswordMail = async (name, email, user_id) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      secure: false,
      auth: {
        user: "luciferlordsa321@gmail.com",
        pass: "gobxbiovuyuiggxh",
      },
    });

    const emailTemplate = path.join(__dirname, "../view/Email/Email.ejs");
    const data = await ejs.renderFile(emailTemplate, {
      name,
      email,
      user_id,
    });

    var mailOptions = {
      from: "luciferlordsa321@gmail.com",
      to: email,
      bcc: "neet18101@gmail.com",
      subject: "Verify Your Account",
      html: data,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email Sent " + info.response);
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

// create Token
const generateAccessToken = (data) => {
  const token = jwt.sign(data, process.env.SECERT_JWT_TOKEN, {
    expiresIn: "24h",
  });
  return token;
};
// create token
const create_token = async (data) => {
  try {
    const userDataString = JSON.stringify(data);

    const secretKey = process.env.SECERT_JWT_TOKEN;
    // Encrypt userDataString using AES encryption
    const encryptedData = CryptoJS.AES.encrypt(
      userDataString,
      secretKey
    ).toString();
    return encryptedData;

    //
  } catch (error) {
    console.log(error.message);
  }
};
// signup Api
const signupUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phonenumber,
      image,
      userType,
      userFor,
      propertyType,
    } = req.body;
    if (!email || !password || !phonenumber || !name) {
      res.status(400).send("All fields are required");
    }

    const checkEmail = await userModel.findOne({ email: email });
    if (checkEmail) {
      res
        .status(200)
        .send({ code: 208, success: false, msg: "Emai Already Exists" });
    } else {
      const userData = new userModel({
        name,
        email,
        password,
        phonenumber,
        image,
        userType,
        userFor,
        propertyType,
      });
      const userKaDataSaver = await userData.save();

      // sendResetPasswordMail(
      //   userKaDataSaver.name,
      //   userKaDataSaver.email,
      //   userKaDataSaver._id
      // );
      const token = await create_token(userKaDataSaver);
      // console.log(token,"userKaDataSaver");

      const response = {
        success: true,
        msg: "Singup Successfully",
        // id: userKaDataSaver._id,
        // type: userKaDataSaver.userType,
        // propertyType: userKaDataSaver.propertyType,
        // token: token,
      };
      return res.status(200).send(response);
    }
    res.status(200).send("Sign up successfully");
  } catch (error) {
    console.log(error.message);
  }
};

// Login Api
// const propertyDetails = async (req, res) => {
//   try {
//     const property = await userModel.findOne({ _id: req.params.id });
//     res.status(200).send({ success: true, data: property });
//   } catch (error) {
//     console.log(error.message);
//   }
// };

// Login Function
const user_loin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await userModel.findOne({ email: email });
    if (userData) {
      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (isPasswordValid) {
        const dataStore = {
          name: userData.name,
          email: userData.email,
          phonenumber: userData.phonenumber,
          image: userData.image,
          type: userData.userType,
          isNew: true,
        };
        const tokenData = await generateAccessToken(dataStore);
        const response = {
          success: true,
          msg: "Login Successfully",
          token: tokenData,
        };
        return res.status(200).send(response);
      } else {
        return res
          .status(200)
          .send({ success: false, msg: "Invalid Credentials" });
      }
    } else {
      return res
        .status(200)
        .send({ success: false, msg: "Invalid Credentials" });
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};
// ListPropertys
const listProperty = async (req, res) => {
  try {
    // console.log(req.body);

    // // Construct data object for complete data
    const completeData = {
      propertyData: req.body.propertyData,
      localityDetails: req.body.localityDetails,
      rentalDetail: req.body.rentalDetail,
      amenities: req.body.amenities,
      // gallery: savedImages.map((image) => image._id), // Store IDs of saved gallery images
      scheduleVisit: req.body.scheduleVisit,
      user_id: req.body.scheduleVisit?.user_id,
    };
    console.log(completeData);

    // // Save complete data to MongoDB
    await PropertyDetail.create(completeData);
    return res.status(200).json({ message: "Property added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const galleryApi = async (req, res) => {
  try {
    // Assuming user_id is sent in the request body
    const files = req.files;
    const user_id = req.body.user_id;
    // console.log(req.files)

    var imageArray = [];

    // Save each image to MongoDB
    for (i = 0; i < files.length; i++) {
      const imagePath = "/public/assets/" + req.files[i].filename;
      console.log(imagePath);
      imageArray[i] = req.files[i].filename;
    }
    var propertyImage = new gallery({
      filename: imageArray,
      user_id: user_id,
    });
    const imageSave = await propertyImage.save();
    res.status(201).json({
      success: true,
      message: "Images added successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const scheduleApi = async (req, res) => {
  try {
    console.log(req.body);
    const schedules = new schedule(req.body);
    await schedules.save();
    res.status(201).json({ message: "schedule added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const userInfoById = async (req, res) => {
  try {
    const userId = req.params.id;
    const userInfo = await userModel.findById(userId);

    if (!userInfo) {
      return res.status(404).send("User not found");
    } else {
      return res.status(200).send(userInfo);
    }

    res.status(200).send(userInfo);
  } catch (error) {
    res.status(500).send(error);
  }
};

//make join collection by using user_id
const ownerDetails = async (req, res) => {
  const owner_id = req.query.ownerId;
  try {
    let ownerData = await userModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(owner_id),
          is_active: 1, // Additional global $match stage for the main collection
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
        },
      },

      {
        $lookup: {
          from: "gallerymodals",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner_id", "$$userId"] },
                    { $eq: ["$is_active", 1] },
                  ],
                },
              },
            },
            {
              $project: {
                filename: 1,
              },
            },
          ],
          as: "galleryData",
        },
      },
      {
        $lookup: {
          from: "amentiesmodals",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner_id", "$$userId"] },
                    { $eq: ["$is_active", 1] },
                  ],
                },
              },
            },
          ],
          as: "amentiesData",
        },
      },
      {
        $lookup: {
          from: "localmodels",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner_id", "$$userId"] },
                    { $eq: ["$is_active", 1] },
                  ],
                },
              },
            },
          ],
          as: "localData",
        },
      },
      {
        $lookup: {
          from: "propertymodels",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner_id", "$$userId"] },
                    { $eq: ["$is_active", 1] },
                  ],
                },
              },
            },
          ],
          as: "propertyData",
        },
      },
      {
        $lookup: {
          from: "rentaldetails",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner_id", "$$userId"] },
                    { $eq: ["$is_active", 1] },
                  ],
                },
              },
            },
          ],
          as: "rentalData",
        },
      },
      {
        $lookup: {
          from: "schedulemodels",
          let: { userId: "$user_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$owner_id", "$$userId"] },
                    { $eq: ["$is_active", 1] },
                  ],
                },
              },
            },
          ],
          as: "scheduleData",
        },
      },
    ]);
    if (ownerData.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Owner found" });
    }

    res.status(200).json(ownerData);
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  ownerDetails,
  signupUser,
  // loacalityApi,
  // rentalApi,
  // amentiesApi,
  galleryApi,
  scheduleApi,
  user_loin,
  listProperty,
  userInfoById,
};
