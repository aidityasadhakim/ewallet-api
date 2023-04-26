import User from "../models/users-model.js";

const getUser = async (req, res) => {
  const user = await User.find();

  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

export { getUser };
