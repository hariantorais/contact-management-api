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
    origin: ["https://cm-demo.elijabah.com", "https://elijabah.com"],
    method: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// Menghubungkan route
app.use("/api", apiRoute);

app.use(errorMiddleware);

module.exports = app;
