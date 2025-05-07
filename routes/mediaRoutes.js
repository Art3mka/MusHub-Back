const express = require("express");

const mediaController = require("../controllers/mediaController");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router.post("/upload", isAuth, mediaController.uploadMedia);

router.get("/", isAuth, mediaController.getAllMedia);

router.get("/search", isAuth, mediaController.searchMedia);

router.get("/:mediaId", isAuth, mediaController.getMediaById);

router.get("/:mediaId/check-like", isAuth, mediaController.checkLike);

router.post("/like/:mediaId", isAuth, mediaController.toggleLike);

router.post("/comment/:mediaId", isAuth, mediaController.addComment);

router.get("/comment/:mediaId", isAuth, mediaController.getComments);

module.exports = router;
