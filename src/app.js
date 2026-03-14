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

app.use(errorMiddleware);
// Menghubungkan route
app.use("/api", apiRoute);
app.get("/api/check", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "API Jendela Haramain - Elijabah Ready!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database_connected: !!process.env.DATABASE_URL,
  });
});

module.exports = app;
