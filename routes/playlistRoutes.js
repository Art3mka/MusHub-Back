const express = require("express");

const playlistController = require("../controllers/playlistController");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router.post("/", isAuth, playlistController.createPlaylist);

router.get("/my", isAuth, playlistController.getUserPlaylists);

router.get("/:playlistId", isAuth, playlistController.getPlaylistById);

router.patch("/:playlistId", isAuth, playlistController.updatePlaylist);

router.delete("/:playlistId", isAuth, playlistController.deletePlaylist);

router.post("/:playlistId/add/:mediaId", isAuth, playlistController.addToPlaylist);

router.delete("/:playlistId/remove/:mediaId", isAuth, playlistController.removeFromPlaylist);

module.exports = router;
