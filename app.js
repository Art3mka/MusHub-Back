require("dotenv").config();
const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "media/");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4());
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "audio/mpeg") {
    cb(null, true);
  } else {
    cb(new Error(`Только аудио файлы! ${file.mimetype}`), false);
  }
};
const authRoutes = require("./routes/authRoutes");
const mediaRoutes = require("./routes/mediaRoutes");
const playlistRoutes = require("./routes/playlistRoutes");
const userRoutes = require("./routes/userRoutes");

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(multer({ storage: storage, fileFilter: fileFilter }).single("music"));
app.use("/media", express.static(path.join(__dirname, "media")));

// Роуты авторизации
app.use("/api/auth", authRoutes);
// Роуты медиа
app.use("/api/media", mediaRoutes);
// Роуты плейлистов
app.use("/api/playlists", playlistRoutes);
// Роуты юзера
app.use("/api/users", userRoutes);

//Обработка ошибок
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.message;
  res.status(status).json({
    message: message,
    data: data,
  });
});

// Подключение к MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then((result) => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000);
    console.log("Server started");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
