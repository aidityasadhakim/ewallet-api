import jwtDecode from "jwt-decode";
import User from "../models/users-model.js";

const getUser = async (req, res) => {
  const user = await User.find().select("-_id");

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

const getBalance = async (req, res) => {
  const userId = jwtDecode(req.headers.authorization).id;
  const user = await User.findById(userId);

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ balance: user.balance });
};

export { getUser, getBalance };
