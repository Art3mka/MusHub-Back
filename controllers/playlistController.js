const Playlist = require("../models/Playlist");
const Media = require("../models/Media");

exports.createPlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;
    const playlist = new Playlist({
      name: name,
      description: description,
      authorId: req.userId,
      isPublic: isPublic,
    });
    const result = await playlist.save();
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, mediaId } = req.params;

    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { _id: playlistId, authorId: req.userId },
      { $addToSet: { mediaItems: mediaId } },
      { new: true }
    );

    if (!updatedPlaylist) {
      return res.status(404).json({ error: "Плейлист не найден или нет прав" });
    }

    res.status(200).json(updatedPlaylist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ authorId: req.userId }).populate("mediaItems", "title");
    if (!playlists) {
      return res.status(404).json({ message: "У данного пользователя нет плейлистов" });
    }
    res.status(200).json(playlists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlaylistById = async (req, res, next) => {
  const { playlistId } = req.params;
  try {
    const playlist = await Playlist.findById(playlistId)
      .populate("authorId", "username")
      .populate("mediaItems", "title path");

    if (!playlist) {
      return res.status(404).json({ error: "Плейлист не найден" });
    }

    if (!playlist.isPublic && playlist.authorId._id.toString() !== req.userId) {
      return res.status(403).json({ error: "Нет доступа к этому плейлисту" });
    }

    res.status(200).json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, mediaId } = req.params;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, authorId: req.userId },
      { $pull: { mediaItems: mediaId } },
      { new: true }
    );

    if (!playlist) {
      return res.status(404).json({ error: "Плейлист не найден или нет прав" });
    }

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePlaylist = async (req, res, next) => {
  const { playlistId } = req.params;
  try {
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.findOneAndUpdate(
      { _id: playlistId, authorId: req.userId },
      { name, description, isPublic },
      { new: true }
    ).populate("mediaItems", "title path");

    if (!playlist) {
      return res.status(404).json({ error: "Плейлист не найден или нет прав" });
    }

    res.json(playlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePlaylist = async (req, res, next) => {
  const { playlistId } = req.params;
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: playlistId,
      authorId: req.userId,
    });

    if (!playlist) {
      return res.status(404).json({ error: "Плейлист не найден или нет прав" });
    }

    res.json({ message: "Плейлист удалён" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
