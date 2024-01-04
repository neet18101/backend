const mongoose = require("mongoose");
const User = require("../model/userModel");

var mongooseUrl = process.env.DB_URL;
mongoose.connect(mongooseUrl);
var dbconnect = mongoose.connection;
dbconnect.on("error", () => {
  console.log("database Connection failed");
});
dbconnect.on("connected", () => {
  console.log("database Connection successfully");
});
module.exports = mongoose;

// const seederDB = [
//   [
    // {
    //   name: "John Doe",
    //   email: "johndoe@example.com",
    //   phonenumber: "1234567890",
    //   Date: "2020-01-01",
    //   is_verified: "1",
    //   Status: "1",
    //   image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
    //   password: "9876543210",
    // },
//     {
//       name: "Jane Smith",
//       email: "janesmith@example.com",
//       phonenumber: "0987654321",
//       Date: "2020-02-15",
//       is_verified: "0",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "1234567890",
//     },
//     {
//       name: "David Johnson",
//       email: "davidjohnson@example.com",
//       phonenumber: "4567890123",
//       Date: "2020-03-30",
//       is_verified: "1",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "5432109876",
//     },
//     {
//       name: "Sarah Williams",
//       email: "sarahwilliams@example.com",
//       phonenumber: "7890123456",
//       Date: "2020-04-22",
//       is_verified: "1",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "6789054321",
//     },
//     {
//       name: "Michael Brown",
//       email: "michaelbrown@example.com",
//       phonenumber: "2345678901",
//       Date: "2020-05-10",
//       is_verified: "1",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "3456789012",
//     },
//     {
//       name: "Emily Jones",
//       email: "emilyjones@example.com",
//       phonenumber: "5678901234",
//       Date: "2020-06-18",
//       is_verified: "1",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "4567890123",
//     },
//     {
//       name: "Christopher Davis",
//       email: "christopherdavis@example.com",
//       phonenumber: "8901234567",
//       Date: "2020-07-29",
//       is_verified: "0",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "5678901234",
//     },
//     {
//       name: "Olivia Miller",
//       email: "oliviamiller@example.com",
//       phonenumber: "3456789012",
//       Date: "2020-08-14",
//       is_verified: "0",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "6789012345",
//     },
//     {
//       name: "Daniel Wilson",
//       email: "danielwilson@example.com",
//       phonenumber: "6789012345",
//       Date: "2020-09-27",
//       is_verified: "0",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "7890123456",
//     },
//     {
//       name: "Sophia Taylor",
//       email: "sophiataylor@example.com",
//       phonenumber: "9012345678",
//       Date: "2020-10-05",
//       is_verified: "0",
//       Status: "1",
//       image: "https://yashadmin.dexignzone.com/xhtml/images/user.jpg",
//       password: "8901234567",
//     },
//   ],
// ];

// const seedDB = async () => {
//   await User.deleteMany({});
//   // await User.insertMany(seederDB.flat());
// };

// seedDB();
