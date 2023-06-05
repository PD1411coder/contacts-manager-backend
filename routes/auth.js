const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const router = express.Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = "iamagoodb$oy"

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      error: "Please enter all fields",
    });
  }
  const emailReg =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+(.[a-zA-Z0-9]{2,4})?$/;

  if (!emailReg.test(email))
    return res.status(400).json({
      error: "Please enter a valid email",
    });

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        error: "User does not exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid credentials",
      });
    }
    const payload = { _id: user._id };
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: 3600,
    });

    const userData = { ...user._doc, password: undefined };
    return res.status(200).json({
      success: true,
      token,
      userData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  //checking all fields
  if (!email || !password) {
    return res.status(400).json({
      error: "Please enter all fields",
    });
  }

  //validating email
  const emailReg =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+(.[a-zA-Z0-9]{2,4})?$/;

  if (!emailReg.test(email))
    return res.status(400).json({
      error: "Please enter a valid email",
    });

  //checking password length
  if (password.length < 8)
    return res.status(400).json({
      error: "Please enter a password with at least 8 characters",
    });

  try {
    const userAlreadyExist = await User.findOne({ email });
    if (userAlreadyExist) {
      return res.status(400).json({
        error: "User does not exist",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, password: hashedPassword });

    //save the user

    const result = await newUser.save();

    return res.status(201).json({
      message: "User created successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: err.message,
    });
  }
});

module.exports = router;
