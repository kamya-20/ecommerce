const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const verifyJWT = require("./middleware/auth"); // this is a fxn jo we created khud

dotenv.config();
const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // frontend URL
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MONGODB error:", err));

app.use("/auth", authRoutes);

// when someone sends req
app.get("/", (req, res) => {
  res.send("Server is running");
});

// protected route
app.get("/profile", verifyJWT, (req, res) => {
  console.log("👉 User from JWT middleware:", req.user); // Add this
  res.json({ message: "Welcome to profile !", user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
