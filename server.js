import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import User from "./models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import authMiddleware from "./middleware/auth.js";

const app = express();

app.use(cors());
app.use(express.json());

// DB connect
mongoose.connect("mongodb://127.0.0.1:27017/studyTracker")
  .then(() => console.log("DB Connected"))
  .catch(err => console.log(err));


// ================= REGISTER =================
app.post("/register", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ name, email, password: hashed });
    await user.save();

    res.json({ message: "Registered" });

  } catch {
    res.status(500).json({ message: "Error" });
  }
});


// ================= LOGIN =================
app.post("/login", async (req, res) => {

  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);

  if (!match) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign({ id: user._id }, "secretkey123", {
    expiresIn: "1d"
  });

  res.json({
    token,
    user: { name: user.name, email: user.email }
  });

});



app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Protected Data", user: req.user });
});


app.listen(5000, () => console.log("Server running"));