const express = require("express");
const cors = require("cors");
const companyRouter = require("./routes/companyRoutes.js");
const jobRouter = require("./routes/jobRoutes.js");
// applicationRouter handles everything to do with job applications:
//   POST   /api/applications            → seeker applies to a job
//   GET    /api/applications/me         → seeker views their own applications
//   GET    /api/applications/job/:id    → recruiter views applicants for a job
const applicationRouter = require("./routes/applicationRoutes.js");
const savedJobRouter = require("./routes/savedJobRoutes.js");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true, // required so the browser sends cookies cross-origin
  }),
);

app.use("/api/companies", companyRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/saved-jobs", savedJobRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Server is healthy and routing works!" });
});

module.exports = app;
