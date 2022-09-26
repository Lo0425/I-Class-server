const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.post("/register", async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({ msg: "Email already exists", status: 400 });

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const user = new User(req.body); //{email:johndoe@gmail.com,username:"johndoe"}
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    user.password = hash;
    user.save();
    return res.json({ user, msg: "Registered successfully" });
  } catch (e) {
    return res.json({ e, msg: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    let userFound = await User.findOne({
      email,
    });

    if (!userFound)
      return res.status(400).json({
        msg: "User doen't exist",
        status: 400,
      });

    let isMatch = bcrypt.compareSync(password, userFound.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Wrong Password", status: 400 });

    jwt.sign(
      {
        data: userFound,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "1h",
      },
      (err, token) => {
        if (err)
          return res.status(400).json({
            err,
            status: 400,
          });
        return res.json({ token, msg: "Login Successfully" });
      }
    );
  } catch (e) {
    return res.json({
      e,
      msg: "Invalid Credential",
    });
  }
});

module.exports = router;
