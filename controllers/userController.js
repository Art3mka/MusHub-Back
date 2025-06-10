const User = require("../models/User");
const Comment = require("../models/Comment");
const Media = require("../models/Media");

exports.getUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).populate("likedMedia").populate("uploadedMedia");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      profile: {
        id: user._id,
        name: user.name,
        createdAt: user.createdAt,
      },
      likedMedia: user.likedMedia,
      uploadedMedia: user.uploadedMedia,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, "-password");
    if (!users) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, role } = req.body;
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Недостаточно прав" });
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, { name, role }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }
    await Media.updateMany({ authorId: userId }, { $set: { authorName: name } });
    res.status(200).json({ updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  if (req.userRole !== "ADMIN") {
    return res.status(403).json({ error: "Недостаточно прав" });
  }
  try {
    const result = await User.findByIdAndDelete(userId);
    const comments = await Comment.find({ userId });
    for (const comment of comments) {
      await comment.deleteOne();
    }
    res.status(200).json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
