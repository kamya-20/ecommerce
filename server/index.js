const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const sendMail = require("./utils/sendMail");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth");
const verifyJWT = require("./middleware/auth"); // this is a fxn jo we created khud

dotenv.config();
const app = express();
app.set("trust proxy", 1);

// const allowedOrigins = ["https://cartify-woad-six.vercel.app", "http://localhost:3000"];

// app.use((req, res, next) => {
//   const origin = req.headers.origin;
//   if (allowedOrigins.includes(origin)) {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//   }
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });

const allowedOrigins = ["https://cartify-woad-six.vercel.app", "http://localhost:3000"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// app.use(cors({ origin: ["https://cartify-woad-six.vercel.app/", "http://localhost:3000"], credentials: true })); // frontend URL
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

app.post("/api/order/place", async (req, res) => {
  try {
    const { email, total, items } = req.body; // frontend se aa raha hai email, total & items

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is missing!" });
    }

    console.log("📧 Sending order confirmation to:", email);

    // 🛒 Generate HTML for ordered items
    const itemList = items
      .map(
        (item) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.title}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₹${item.price}</td>
          </tr>`
      )
      .join("");

    //  Final email HTML
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #2b2b2b;">🛍️ Thank you for your order!</h2>
        <p>We’ve received your order and will notify you once it ships.</p>

        <h3>Order Summary:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f8f8f8;">
              <th style="padding: 10px; border: 1px solid #ddd;">Item</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Quantity</th>
              <th style="padding: 10px; border: 1px solid #ddd;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemList}
          </tbody>
        </table>

        <h3 style="margin-top: 20px;">Total Amount: ₹${total}</h3>
        <p style="color: gray;">We appreciate your trust in <b>Cartify</b>! 💖</p>
      </div>
    `;

    // 📤 Send mail
    await sendMail(email, "Order Confirmation - Cartify", htmlContent);

    // ✅ Response to frontend
    res.json({ success: true, message: "Email sent successfully!" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, message: "Email sending failed." });
  }
});

app.get("/profile", verifyJWT, (req, res) => {
  console.log("👉 User from JWT middleware:", req.user); // Add this
  res.json({ message: "Welcome to profile !", user: req.user });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
