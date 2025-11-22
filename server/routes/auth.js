const express = require("express");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// POST /auth/google-signup
router.post("/google-signup", async (req, res) => {
  // res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // res.setHeader("Access-Control-Allow-Credentials", "true");

  const { token } = req.body;
  console.log("🔹 Received Google ID token:", token?.substring(0, 20) + "...");

  try {
    // Step 1: Verify token with Google
    console.log("🔹 Verifying token with Google...");
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    if (!ticket) {
      console.error("❌ Google token verification failed: No ticket returned");
      return res.status(401).json({ message: "Google verification failed" });
    }

    const payload = ticket.getPayload();
    console.log("✅ Google token payload:", payload);

    const { email, name, picture, sub } = payload;

    // Step 2: Check if user exists
    console.log(`🔹 Checking DB for user: ${email}`);
    let user = await User.findOne({ email });

    if (!user) {
      console.log("⚠️ No user found — creating new one...");
      user = await User.create({ name, email, picture, googleId: sub });
    } else {
      console.log("✅ User found in DB");
    }

    // Step 3: Generate JWT
    const appToken = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });
    console.log("generated jwt token");

    // Step 4: Send cookie
    res.cookie("token", appToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("✅ Login success for:", email);
    res.status(200).json({ user, token: appToken });
    console.log("user signing up");
  } catch (error) {
    console.error("❌ Google signup failed:", error.message || error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

// POST /auth/google-login
router.post("/google-login", async (req, res) => {
  console.log("🔹 Request body received:", req.body); // Check what frontend sent
  const { token } = req.body;
  console.log("Token received for verification:", token);

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    console.log("Google payload:", payload);
    const { email, name, picture, sub } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found. Please sign up first." });
    }

    const appToken = jwt.sign({ id: user._id, email: user.email, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", appToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    }); // ✅ send JSON
    // 🔹 yaha redirect karwa do
    // res.redirect("http://localhost:3000/profile");
    console.log("user logged in");
  } catch (error) {
    console.error("❌ Google login failed:", error.message || error);
    res.status(401).json({ message: "Invalid Google Token" });
  }
});

module.exports = router;

// router.post("/google-login", async (req, res) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   const { token } = req.body;

//   console.log("Recieved token from frontend -> ", token);
//   // return res.status(200).json({ message: "Dummy success", tokenReceived: token });

//   try {
//     // 1. Verify token with Google
//     const ticket = await client.verifyIdToken({
//       idToken: token,
//       audience: process.env.GOOGLE_CLIENT_ID,
//     });

//     const payload = ticket.getPayload();
//     const { email, name, picture } = payload;

//     // 2. Check if user exists, else create
//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({ name, email, picture });
//     }

//     // 3. Generate your own JWT
//     const appToken = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     // 4. Send it as cookie
//     res.cookie("token", appToken, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "Lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.status(200).json({ user, token: appToken });
//   } catch (error) {
//     console.error("Google login failed:", error);
//     res.status(401).json({ message: "Invalid Google Token" });
//   }
// });
