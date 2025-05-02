require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const authRoutes = require("./routes/authRoutes");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Тестовый роут
app.get("/", (req, res) => {
  res.send("Audio/Video Service API");
});

// Роуты авторизации
app.use("/api/auth", authRoutes);

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
