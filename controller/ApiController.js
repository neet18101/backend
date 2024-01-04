const path = require("path");
const ejs = require("ejs");
const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
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
      res.status(200).send({ success: false, msg: "Emai Already Exists" });
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
      sendResetPasswordMail(
        userKaDataSaver.name,
        userKaDataSaver.email,
        userKaDataSaver._id
      );
      return res.status(200).send({
        success: true,
        msg: "Sign up successfully & Please Verify Your Email",
        data: {
          id: userKaDataSaver._id,
          type: userKaDataSaver.userType,
          propertyType: userKaDataSaver.propertyType,
        },
      });
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
// Secure Password
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
          isNew: true,
        };
        const tokenData = await create_token(dataStore);
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
    const property = new propertyDetails(req.body);
    await property.save();
    res.status(201).json({ message: "Property added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const loacalityApi = async (req, res) => {
  try {
    const loacality = new loacalityDetails(req.body);
    await loacality.save();
    res.status(201).json({ message: "Property added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const rentalApi = async (req, res) => {
  try {
    const rentals = new rental(req.body);
    await rentals.save();
    res.status(201).json({ message: "rental added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const amentiesApi = async (req, res) => {
  try {
    const amentiesData = new amenties(req.body);
    await amentiesData.save();
    res.status(201).json({ message: "Property added successfully" });
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

    const imageArray = [];

    // Save each image to MongoDB
    for (const file of files) {
      const image = new gallery({
        filename: file.filename,
        path: file.path,
        user_id: user_id, // Save the user_id along with the image details
      });

      await image.save();
      imageArray.push(image);
    }

    res.status(201).json({
      message: "Images added successfully",
      images: imageArray.map((img) => ({
        filename: img.filename,
        path: img.path,
      })),
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

    console.log(userInfo, "userInfo");

    res.status(200).send(userInfo);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  signupUser,
  loacalityApi,
  rentalApi,
  amentiesApi,
  galleryApi,
  scheduleApi,
  user_loin,
  listProperty,
  userInfoById,
};
