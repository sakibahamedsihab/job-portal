const express = require("express");
const cors = require("cors");
const companyRouter = require("./routes/companyRoutes.js");
const jobRouter = require("./routes/jobRoutes.js");
const applicationRouter = require("./routes/applicationRoutes.js");
const savedJobRouter = require("./routes/savedJobRoutes.js");
const adminRouter = require("./routes/adminRoutes.js");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/companies", companyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/saved-jobs", savedJobRouter);
app.use("/api/admin", adminRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy and routing works!" });
});

module.exports = app;
