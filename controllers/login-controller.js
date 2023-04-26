import User from "../models/users-model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import "dotenv/config";

export const index = (req, res) => {
  res.send("Hello World");
};

export const login = async (req, res) => {
  const user = await User.findOne({ username: req.body.username });

  if (!user) {
    return res.status(404).json({
      message: "Username is wrong",
    });
  }

  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      username: user.username,
      token: token,
    });
  } else {
    return res.status(401).json({
      message: "Password Incorrect",
    });
  }
};

export const register = async (req, res) => {
  const userCheck = () => {
    return User.findOne({ username: req.body.username });
  };

  if (userCheck) {
    return res.status(409).json({
      success: false,
      message: "Username already exists",
    });
  }

  let user = new User({
    name: req.body.name,
    username: req.body.username,
    password: bcrypt.hashSync(
      req.body.password,
      Number(process.env.PASSWORD_KEY)
    ),
  });

  user = await user.save();

  if (!user) {
    return res.status(500).json({
      success: true,
      message: "Something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    username: user.username,
  });
};
