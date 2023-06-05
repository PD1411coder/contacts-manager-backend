const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExits = await User.findOne({ email: req.params.email });
  if (userExits) {
     res.status(400).json({
        success: false,
        message: "User already exists"
    });
    }

    const user = await User.create({ email, password });
    if (user) {
       res.status(201).json({
        success: true,
        message: "User created successfully"
      });
    }else{
         res.status(400).json({
            success: false,
            message: "User not created"
        });
    }
});

module.exports = {
  registerUser
};
