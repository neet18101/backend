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
const findnearbyModel = require("../model/findnearbyModel");
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
    expiresIn: "360d",
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
          id: userData._id,
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

// token verifiction

const verifyToken = async (req, res) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing token in the request header",
      });
    }
    const token = authHeader.split(" ")[1]; // Split by space and get the second element
    console.log(token);

    try {
      const decode = jwt.verify(token, process.env.SECRET_JWT_TOKEN);
      req.user = decode; // Move this line here after token verification
      const token_expiry = decode.exp;
      const current_date = Math.floor(Date.now() / 1000);
    } catch (error) {
      return res.status(401).send({
        success: false,
        msg: "Invalid Token",
        is_verified: false,
        is_expired: false,
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .send({ success: false, msg: "Internal Server Error" });
  }
};

// ListPropertys
const listProperty = async (req, res) => {
  try {
    const {
      propertyData,
      localityDetails,
      rentalDetail,
      amenities,
      scheduleVisit,
    } = req.body;

    if (
      !propertyData ||
      !localityDetails ||
      !rentalDetail ||
      !amenities ||
      !scheduleVisit
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const apartmentName = propertyData?.apartmentName;
    const property_url = apartmentName.toLowerCase().replace(/\s+/g, "-");

    const completeData = {
      propertyData,
      property_url,
      localityDetails,
      rentalDetail,
      amenities,
      scheduleVisit,
      user_id: scheduleVisit?.user_id,
      gallery: [],
    };
    // const propertyDetail = new PropertyDetail(completeData);

    // Save the property detail data to MongoDB
    // await propertyDetail.save();
    //
    // Save complete data to MongoDB
    const createdProperty = await PropertyDetail.create(completeData);

    return res.status(200).json({
      code: 200,
      message: "Property added successfully",
      id: createdProperty?._id,
    });
  } catch (error) {
    console.error("Error listing property:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const galleryApi = async (req, res) => {
  const { user_id, property_id } = req.body;

  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  // Check if user_id is present
  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, status: 400, error: "user_id not found" });
  }

  const imagePaths = []; // Array to store image paths
  const imageArray = []; // Array to store file names

  for (const file of req.files) {
    const imagePath = `/assets/${file.filename}`;
    // console.log(imagePath);

    // Validate and process the image file (optional)
    // You can add checks for image format, size, etc. here

    imagePaths.push(imagePath); // Store image paths
    imageArray.push(file.filename); // Store filenames for later use
  }
  try {
    // Save images only if user_id is present
    const propertyImage = await GalleryImage.create({
      property_id: property_id,
      user_id: user_id,
      imagePaths: imagePaths,
    });

    // console.log(propertyImage);
    // await propertyImage.crea();

    let objId = new mongoose.Types.ObjectId(propertyImage?._id);
    // console.log(objId, "neet");

    await PropertyDetail.updateOne(
      { _id: property_id },
      { $push: { gallery: objId }, upsert: false, new: true }
    );

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

// <========================Api for home page=========================>
const homePageApi = async (req, res) => {
  try {
    const handPicked = await propertyDetails
      .find({ is_active: 1, handPicked: true })
      .populate({ path: "gallery", model: "galleryModal" });

    const featured = await propertyDetails
      .find({ is_active: 1, featured: true })
      .populate({ path: "gallery", model: "galleryModal" });

    const findbynear = await findnearbyModel.find({ is_active: true });

    // Modification for handpicked and featured
    const modifiedHandPicked = handPicked.map((item) => ({
      _id: item._id,
      apartmentName: item.propertyData.apartmentName,
      property_url: item.property_url,
      gallery: item.gallery[0].imagePaths[0],
      expectRent: item.rentalDetail.expectRent, // Assuming you want only the first image path
    }));
    const modifiedFeatured = featured.map((item) => ({
      _id: item._id,
      apartmentName: item.propertyData.apartmentName,
      property_url: item.property_url,
      gallery: item.gallery[0].imagePaths[0],
      expectRent: item.rentalDetail.expectRent, // Assuming you want only the first image path
    }));
    const finalData = [
      {
        handPicked: modifiedHandPicked,
        featured: modifiedFeatured,
        findbynear: findbynear,
      },
    ];

    res
      .status(200)
      .json({ code: 200, message: "success", apiVersion: "1.0.0", finalData }); // Send finalData as JSON response
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const searchByLocationApi = async (req, res) => {
  try {
    const { query } = req.query;
    // Perform a search based on the query in city, locality, and landmark
    const properties = await propertyDetails
      .find({
        $or: [
          { "localityDetails.city": { $regex: new RegExp(query, "i") } }, // Case-insensitive search for city
          { "localityDetails.locality": { $regex: new RegExp(query, "i") } }, // Case-insensitive search for locality
          { "localityDetails.landmark": { $regex: new RegExp(query, "i") } }, // Case-insensitive search for landmark
        ],
        is_active: 1, // Include additional conditions as needed
      })
      .populate({ path: "gallery", model: "galleryModal" }); // Populate the gallery field

    res
      .status(200)
      .json({ code: 200, apiVersion: "1.0.0", message: "success", properties });
  } catch (error) {
    console.error("Error searching properties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const filterApi = async (req, res) => {
  const {
    city,
    category,
    bhkType,
    priceRange,
    availability,
    preferredTenants,
    furnishing,
    parking,
  } = req.query;
  try {
    let filter = {};

    if (city) filter["localityDetails.city"] = city;
    // if (category) filter["propertyData.apartmentType"] = category;
    if (bhkType) filter["propertyData.bhkType"] = bhkType;
    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split("-");
      filter["rentalDetail.expectRent"] = {
        $gte: parseInt(minPrice),
        $lte: parseInt(maxPrice),
      };
    }
    if (availability) filter["scheduleVisit.availability"] = availability;
    if (preferredTenants)
      filter["rentalDetail.preferredTenant"] = preferredTenants;
    if (furnishing) filter["rentalDetail.furnishing"] = furnishing;
    if (parking) filter["rentalDetail.parking"] = parking;

    const properties = await propertyDetails.find(filter).populate({
      path: "gallery",
      model: "galleryModal",
    });

    if (properties.length === 0) {
      return res.status(404).json({
        code: 404,
        apiVersion: "1.0.0",
        message: "No properties found matching the provided filters",
      });
    }

    res.status(200).json({
      code: 200,
      apiVersion: "1.0.0",
      message: "success",
      properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const productByUrlApi = async (req, res) => {
  const { url } = req.params;
  try {
    const property = await propertyDetails
      .findOne({ property_url: url })
      .populate({ path: "gallery", model: "galleryModal" });
    if (!property) {
      return res.status(404).json({
        code: 404,
        apiVersion: "1.0.0",
        message: "Property not found",
      });
    }
    res.status(200).json({
      code: 200,
      apiVersion: "1.0.0",
      message: "success",
      property,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const propertyByOwnerId = async (req, res) => {
  const { user_id } = req.query;
  try {
    const userInfo = await userModel
      .findById(user_id)
      .select("name email phonenumber userType");
    const properties = await propertyDetails
      .find({ user_id: user_id })
      .populate([{ path: "gallery", model: "galleryModal" }]);

    res.status(200).json({
      code: 200,
      apiVersion: "1.0.0",
      message: "success",
      userInfo,
      properties,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
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
  homePageApi,
  searchByLocationApi,
  verifyToken,
  filterApi,
  productByUrlApi,
  propertyByOwnerId,
};
