const express = require("express");
const cors = require("cors");
const companyRouter = require("./routes/companyRoutes.js");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/companies", companyRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy and routing works!" });
});

module.exports = app;
