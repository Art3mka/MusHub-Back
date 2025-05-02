const Media = require("../models/Media");

exports.uploadMedia = async (req, res, next) => {
  const title = req.body.title;
  const music = req.file;
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Загрузите файл." });
    }
    const media = new Media({
      title: title,
      filename: music.filename,
      path: music.path,
      authorId: req.userId,
      mimetype: music.mimetype,
    });
    const result = await media.save();
    res.status(200).json({ message: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
      next(err);
    }
  }
};

exports.getAllMedia = async (req, res, next) => {
  try {
    const media = await Media.find().populate("authorId", "name");
    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMediaById = async (req, res) => {
  try {
    const mediaId = req.params.mediaId;
    const media = await Media.findById(mediaId).populate("authorId", "name");
    if (!media) {
      return res.status(404).json({ error: "Файл не найден" });
    }

    media.views += 1;
    await media.save();

    res.json(media);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
