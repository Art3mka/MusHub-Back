const express = require("express");

const mediaController = require("../controllers/mediaController");

const router = express.Router();

const isAuth = require("../middleware/isAuth");

router.post("/upload", isAuth, mediaController.uploadMedia);

router.get("/", isAuth, mediaController.getAllMedia);

router.get("/:mediaId", isAuth, mediaController.getMediaById);

module.exports = router;
