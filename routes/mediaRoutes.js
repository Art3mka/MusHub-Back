const express = require("express");

const mediaController = require("../controllers/mediaController");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, mediaController.getAllMedia);

router.get("/categories", mediaController.getMediaByCategories);

router.get("/search", isAuth, mediaController.searchMedia);

router.post("/upload", isAuth, mediaController.uploadMedia);

router.post("/like/:mediaId", isAuth, mediaController.toggleLike);

router.post("/comment/:mediaId", isAuth, mediaController.addComment);

router.get("/comment/:mediaId", isAuth, mediaController.getComments);

router.delete("/:mediaId", isAuth, mediaController.deleteMedia);

router.put("/:mediaId", isAuth, mediaController.updateMedia);

router.get("/:mediaId", isAuth, mediaController.getMediaById);

router.get("/:mediaId/check-like", isAuth, mediaController.checkLike);

module.exports = router;
