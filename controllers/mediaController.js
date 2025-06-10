const fs = require("fs");

const Media = require("../models/Media");
const Like = require("../models/Like");
const Comment = require("../models/Comment");
const User = require("../models/User");

exports.uploadMedia = async (req, res, next) => {
  const title = req.body.title;
  const categoryId = req.body.categoryId;
  const authorName = req.body.authorName;
  const music = req.file;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Загрузите файл." });
    }
    const media = new Media({
      title: title,
      categoryId: categoryId,
      filename: music.filename,
      path: music.path,
      authorId: req.userId,
      authorName: authorName,
      mimetype: music.mimetype,
    });
    const result = await media.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { uploadedMedia: result._id },
    });
    res.status(200).json({ message: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.deleteMedia = async (req, res, next) => {
  try {
    const { mediaId } = req.params;
    const userId = req.userId;

    const media = await Media.findById(mediaId);

    if (!media) {
      return res.status(404).json({ error: "Трек не найден" });
    }
    const authorId = media.authorId;

    if (media.authorId.toString() !== userId.toString() && req.userRole === "ADMIN") {
      await media.deleteOne();

      await User.findByIdAndUpdate(authorId, {
        $pull: { uploadedMedia: mediaId },
      });

      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }
    }

    if (media.authorId.toString() === userId.toString()) {
      await media.deleteOne();

      await User.findByIdAndUpdate(userId, {
        $pull: { uploadedMedia: mediaId },
      });

      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }
    }
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateMedia = async (req, res, next) => {
  try {
    const { mediaId } = req.params;
    const userId = req.userId;
    const updateTitle = req.body.title;
    const updateCategory = req.body.categoryId;

    const media = await Media.findById(mediaId);
    let updatedMedia = null;

    if (req.userRole === "ADMIN" || media.authorId.toString() === userId.toString()) {
      updatedMedia = await Media.findByIdAndUpdate(
        mediaId,
        { title: updateTitle, categoryId: updateCategory },
        { new: true }
      )
        .populate("authorId", "name")
        .populate("categoryId", "title");
    }
    if (!updatedMedia) {
      return res.status(404).json({ error: "Трек не найден" });
    }
    console.log(updatedMedia);
    res.status(200).json({ updatedMedia });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllMedia = async (req, res, next) => {
  try {
    const media = await Media.find().populate("authorId", "name").populate("categoryId", "title");
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMediaById = async (req, res, next) => {
  try {
    const mediaId = req.params.mediaId;
    const media = await Media.findById(mediaId).populate("authorId", "name").populate("categoryId", "title");
    if (!media) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.incrementListens = async (req, res, next) => {
  try {
    const mediaId = req.params.mediaId;
    const media = await Media.findById(mediaId);
    if (!media) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    media.listens += 1;
    await media.save();

    res.json(media.listens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleLike = async (req, res, next) => {
  try {
    const { mediaId } = req.params;

    const existingLike = await Like.findOne({
      userId: req.userId,
      mediaId: mediaId,
    });

    if (existingLike) {
      await Like.findByIdAndDelete(existingLike._id);
      await Media.findByIdAndUpdate(mediaId, { $inc: { likes: -1 } });
      await User.findByIdAndUpdate(req.userId, { $pull: { likedMedia: mediaId } });
      return res.json({ liked: false });
    } else {
      const like = new Like({
        userId: req.userId,
        mediaId: mediaId,
      });
      const result = await like.save();
      await Media.findByIdAndUpdate(mediaId, { $inc: { likes: 1 } });
      await User.findByIdAndUpdate(req.userId, { $addToSet: { likedMedia: mediaId } });
      return res.json({ liked: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { mediaId } = req.params;
    const { text } = req.body;

    const comment = new Comment({
      text: text,
      userId: req.userId,
      mediaId: mediaId,
    });
    console.log(comment);

    const result = await comment.save();

    console.log(result);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComments = async (req, res, next) => {
  const { mediaId } = req.params;
  try {
    const comments = await Comment.find({ mediaId: mediaId }).populate("userId", "name").sort({ createdAt: -1 });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkLike = async (req, res, next) => {
  const { mediaId } = req.params;
  try {
    const like = await Like.findOne({
      userId: req.userId,
      mediaId: mediaId,
    });
    res.json({ liked: !!like });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchMedia = async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query || query.length < 2) {
      return res.status(400).json({ error: "Минимум 2 символа" });
    }
    const results = await Media.find({ title: { $regex: query, $options: "i" } }).populate("authorId", "name");
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMediaByCategories = async (req, res, next) => {
  try {
    const { sort = "likes", category } = req.query;
    const sortOptions = {};

    if (category) {
      sortOptions.categoryId = category;
    }

    const media = await Media.find(sortOptions)
      .sort({ [sort]: -1 })
      .populate("categoryId")
      .populate("authorId");

    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении медиа", error });
  }
};
