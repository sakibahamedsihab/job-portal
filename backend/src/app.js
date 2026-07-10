const express = require("express");
const companyRouter = require("./routes/companyRoutes.js");

const app = express();
app.use(express.json());

app.use("/api/companies", companyRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy and routing works!" });
});

module.exports = app;
