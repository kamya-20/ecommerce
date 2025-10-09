const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const MongoStore = require("connect-mongo");

dotenv.config(); // Load .env file
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
require("./config/passport");

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Server failed to start:", err.message);
  });

// session middleware  (needed for Passport to store user in session)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI, // use the same URI as your DB
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize Passport and use session
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());

// when someone sends get req
app.get("/", (req, res) => {
  res.send("server is running");
});

// Google Auth route
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// Google callback route
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  })
);

// Dashboard route (protected)
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Hello ${req.user.displayName}</h1>`);
  } else {
    res.redirect("/auth/google");
  }
});
