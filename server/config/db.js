const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is connected successfully");
  } catch (err) {
    console.error("MongoDB connection error", err.message);
    process.exit(1);
  }
};

// connectDB()
//   .then(() => {
//     console.log(" MongoDB connected!");
//     app.listen(PORT, () => {
//       console.log(` Server running at http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error(" MongoDB connection failed:", err.message);
//   });

module.exports = connectDB;
