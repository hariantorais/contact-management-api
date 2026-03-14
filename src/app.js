const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const apiRoute = require("./routes/api");
const errorMiddleware = require("./middlewares/error-middleware");
const app = express();

app.use(express.json());

app.use(helmet());
app.use(
  cors({
    origin: "*", // Izinkan semua sementara untuk testing
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

// Menghubungkan route
app.use("/api", apiRoute);

app.use(errorMiddleware);

module.exports = app;
