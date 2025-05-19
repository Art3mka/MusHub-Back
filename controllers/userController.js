const User = require("../models/User");

exports.getUser = async (req, res) => {
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
