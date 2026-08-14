const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
const { MongoClient, ObjectId } = require("mongodb");
const http = require("http");
const { connectDB } = require("../config/db.js");
const app = require("../app");

async function runTestSuite() {
  console.log("\n=======================================================");
  console.log("  STARTING FULL-STACK LOGIC & API END-TO-END TEST SUITE ");
  console.log("=======================================================\n");

  await connectDB();
  const client = new MongoClient(process.env.MONGO_URI);
  await client.connect();
  const db = client.db("job_portal");
  console.log("✓ Connected to MongoDB test database");

  // Start Express server on ephemeral port
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`✓ Test Express server running on port ${port}\n`);

  let passedTests = 0;
  let failedTests = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passedTests++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failedTests++;
    }
  }

  // Helper function for API requests
  async function request(path, options = {}) {
    const url = `${baseUrl}${path}`;
    const headers = { ...(options.headers || {}) };
    if (options.body && typeof options.body === "object") {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(options.body);
    }
    const res = await fetch(url, { ...options, headers });
    let data;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    return { status: res.status, headers: res.headers, body: data };
  }

  // Create temporary test users in MongoDB
  const testSeekerId = new ObjectId();
  const testRecruiterId = new ObjectId();
  const testRecruiter2Id = new ObjectId();
  const testAdminId = new ObjectId();

  const seekerToken = "test_token_seeker_" + Date.now();
  const recruiterToken = "test_token_recruiter_" + Date.now();
  const recruiter2Token = "test_token_recruiter2_" + Date.now();
  const adminToken = "test_token_admin_" + Date.now();

  const now = new Date();
  const futureExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  // Insert test users
  await db.collection("user").insertMany([
    {
      _id: testSeekerId,
      name: "Test Seeker",
      email: `seeker_${Date.now()}@test.com`,
      role: "seeker",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: testRecruiterId,
      name: "Test Recruiter",
      email: `recruiter_${Date.now()}@test.com`,
      role: "recruiter",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: testRecruiter2Id,
      name: "Test Recruiter 2",
      email: `recruiter2_${Date.now()}@test.com`,
      role: "recruiter",
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: testAdminId,
      name: "Test Admin",
      email: `admin_${Date.now()}@test.com`,
      role: "admin",
      createdAt: now,
      updatedAt: now,
    },
  ]);

  // Insert sessions
  await db.collection("session").insertMany([
    {
      _id: new ObjectId(),
      userId: testSeekerId,
      token: seekerToken,
      expiresAt: futureExpiry,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: new ObjectId(),
      userId: testRecruiterId,
      token: recruiterToken,
      expiresAt: futureExpiry,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: new ObjectId(),
      userId: testRecruiter2Id,
      token: recruiter2Token,
      expiresAt: futureExpiry,
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: new ObjectId(),
      userId: testAdminId,
      token: adminToken,
      expiresAt: futureExpiry,
      createdAt: now,
      updatedAt: now,
    },
  ]);

  const seekerCookie = `better-auth.session_token=${seekerToken}`;
  const recruiterCookie = `better-auth.session_token=${recruiterToken}`;
  const recruiter2Cookie = `better-auth.session_token=${recruiter2Token}`;
  const adminCookie = `better-auth.session_token=${adminToken}`;

  try {
    console.log("--- 1. Health & Public Endpoints ---");
    const healthRes = await request("/health");
    assert(healthRes.status === 200, "GET /health returns 200");

    const publicJobsRes = await request("/api/jobs");
    assert(publicJobsRes.status === 200 && Array.isArray(publicJobsRes.body?.jobs), "GET /api/jobs returns job list");

    const publicCompaniesRes = await request("/api/companies");
    assert(publicCompaniesRes.status === 200 && Array.isArray(publicCompaniesRes.body?.data), "GET /api/companies returns companies list");

    console.log("\n--- 2. Auth & Role Protection ---");
    const unauthRes = await request("/api/applications/me");
    assert(unauthRes.status === 401, "Unauthenticated access to protected route returns 401");

    const seekerPostingJobRes = await request("/api/jobs", {
      method: "POST",
      headers: { Cookie: seekerCookie },
      body: { title: "Hacker Job" },
    });
    assert(seekerPostingJobRes.status === 403, "Seeker posting job forbidden with 403");

    const recruiterApplyingRes = await request("/api/applications", {
      method: "POST",
      headers: { Cookie: recruiterCookie },
      body: { jobId: new ObjectId().toString() },
    });
    assert(recruiterApplyingRes.status === 403, "Recruiter applying to job forbidden with 403");

    const seekerAccessingAdminRes = await request("/api/admin/stats", {
      headers: { Cookie: seekerCookie },
    });
    assert(seekerAccessingAdminRes.status === 403, "Non-admin accessing admin stats forbidden with 403");

    console.log("\n--- 3. Recruiter Flow: Company & Job Creation ---");
    // Attempt to post job before company profile
    const jobWithoutCompany = await request("/api/jobs", {
      method: "POST",
      headers: { Cookie: recruiterCookie },
      body: { title: "Software Engineer", location: "Remote", salary: "$100k", description: "Build awesome software" },
    });
    assert(jobWithoutCompany.status === 403, "Recruiter cannot post job without company profile");

    // Create Company
    const createCompanyRes = await request("/api/companies", {
      method: "POST",
      headers: { Cookie: recruiterCookie },
      body: { name: "Test Corp", website: "https://testcorp.example.com", description: "Innovators in Tech" },
    });
    assert(createCompanyRes.status === 200 && createCompanyRes.body?.success === true, "Recruiter creates company profile successfully");

    // Duplicate Company prevention
    const dupCompanyRes = await request("/api/companies", {
      method: "POST",
      headers: { Cookie: recruiterCookie },
      body: { name: "Test Corp 2", website: "https://testcorp2.example.com", description: "Second company" },
    });
    assert(dupCompanyRes.status === 400, "Recruiter prevented from creating duplicate company profile (400)");

    // Get My Company
    const myCompanyRes = await request("/api/companies/me", {
      headers: { Cookie: recruiterCookie },
    });
    assert(myCompanyRes.status === 200 && myCompanyRes.body?.company?.name === "Test Corp", "Recruiter fetches own company profile");

    // Post Job
    const postJobRes = await request("/api/jobs", {
      method: "POST",
      headers: { Cookie: recruiterCookie },
      body: {
        title: "Senior Full Stack Engineer",
        location: "Remote",
        salary: "$120,000 - $140,000",
        description: "Develop high-scale cloud web applications.",
      },
    });
    assert(postJobRes.status === 201 && postJobRes.body?.success === true, "Recruiter posts job successfully (201)");
    const createdJobId = postJobRes.body?.jobId;

    // Get Job by ID
    const getJobRes = await request(`/api/jobs/${createdJobId}`);
    assert(getJobRes.status === 200 && getJobRes.body?.job?.title === "Senior Full Stack Engineer", "Get job by ID returns job details");

    // Recruiter getMyJobs
    const myJobsRes = await request("/api/jobs/me", {
      headers: { Cookie: recruiterCookie },
    });
    assert(myJobsRes.status === 200 && myJobsRes.body?.jobs?.some((j) => j._id === createdJobId), "Recruiter fetches posted jobs");

    console.log("\n--- 4. Seeker Flow: Job Application & Saved Jobs ---");
    // Apply to Job
    const applyRes = await request("/api/applications", {
      method: "POST",
      headers: { Cookie: seekerCookie },
      body: { jobId: createdJobId },
    });
    assert(applyRes.status === 201 && applyRes.body?.success === true, "Seeker applies to job successfully (201)");
    const createdApplicationId = applyRes.body?.applicationId;

    // Duplicate Application Prevention
    const dupApplyRes = await request("/api/applications", {
      method: "POST",
      headers: { Cookie: seekerCookie },
      body: { jobId: createdJobId },
    });
    assert(dupApplyRes.status === 409, "Duplicate job application rejected with 409 Conflict");

    // Get My Applications
    const myAppsRes = await request("/api/applications/me", {
      headers: { Cookie: seekerCookie },
    });
    assert(
      myAppsRes.status === 200 &&
        myAppsRes.body?.applications?.some((a) => a._id === createdApplicationId && a.status === "pending"),
      "Seeker retrieves their job applications list"
    );

    // Save/Bookmark Job
    const saveJobRes = await request("/api/saved-jobs/toggle", {
      method: "POST",
      headers: { Cookie: seekerCookie },
      body: { jobId: createdJobId },
    });
    assert(saveJobRes.status === 201 && saveJobRes.body?.saved === true, "Seeker saves/bookmarks a job");

    // Check if Saved
    const checkSavedRes = await request(`/api/saved-jobs/check/${createdJobId}`, {
      headers: { Cookie: seekerCookie },
    });
    assert(checkSavedRes.status === 200 && checkSavedRes.body?.isSaved === true, "Check saved job returns isSaved: true");

    // Get My Saved Jobs
    const mySavedRes = await request("/api/saved-jobs/me", {
      headers: { Cookie: seekerCookie },
    });
    assert(
      mySavedRes.status === 200 && mySavedRes.body?.savedJobs?.some((s) => s.jobId === createdJobId),
      "Seeker retrieves their saved jobs list"
    );

    // Unsave Job (Toggle)
    const unsaveJobRes = await request("/api/saved-jobs/toggle", {
      method: "POST",
      headers: { Cookie: seekerCookie },
      body: { jobId: createdJobId },
    });
    assert(unsaveJobRes.status === 200 && unsaveJobRes.body?.saved === false, "Seeker removes job from saved jobs via toggle");

    console.log("\n--- 5. Recruiter Review & Permission Isolation ---");
    // Recruiter 1 views applicants
    const applicantsRes = await request(`/api/applications/job/${createdJobId}`, {
      headers: { Cookie: recruiterCookie },
    });
    assert(
      applicantsRes.status === 200 &&
        applicantsRes.body?.applicants?.some((a) => a._id === createdApplicationId),
      "Recruiter views applicants for their posted job"
    );

    // Recruiter 2 attempts to view Recruiter 1's applicants -> 403
    const unauthorizedApplicantsRes = await request(`/api/applications/job/${createdJobId}`, {
      headers: { Cookie: recruiter2Cookie },
    });
    assert(unauthorizedApplicantsRes.status === 403, "Recruiter 2 cannot view Recruiter 1's job applicants (403)");

    // Recruiter updates application status to 'accepted'
    const updateStatusRes = await request(`/api/applications/${createdApplicationId}/status`, {
      method: "PATCH",
      headers: { Cookie: recruiterCookie },
      body: { status: "accepted" },
    });
    assert(updateStatusRes.status === 200 && updateStatusRes.body?.status === "accepted", "Recruiter updates applicant status to 'accepted'");

    // Invalid status rejected
    const invalidStatusRes = await request(`/api/applications/${createdApplicationId}/status`, {
      method: "PATCH",
      headers: { Cookie: recruiterCookie },
      body: { status: "invalid_status_xyz" },
    });
    assert(invalidStatusRes.status === 400, "Invalid application status rejected with 400");

    console.log("\n--- 6. Admin Management & Moderation ---");
    // Admin Stats
    const adminStatsRes = await request("/api/admin/stats", {
      headers: { Cookie: adminCookie },
    });
    assert(adminStatsRes.status === 200 && adminStatsRes.body?.stats?.totalUsers >= 4, "Admin retrieves system overview stats");

    // Admin Users List
    const adminUsersRes = await request("/api/admin/users", {
      headers: { Cookie: adminCookie },
    });
    assert(
      adminUsersRes.status === 200 &&
        adminUsersRes.body?.users?.some((u) => u._id === testSeekerId.toString() || u._id?.toString() === testSeekerId.toString()),
      "Admin retrieves full user accounts list"
    );

    // Admin Jobs List
    const adminJobsRes = await request("/api/admin/jobs", {
      headers: { Cookie: adminCookie },
    });
    assert(
      adminJobsRes.status === 200 &&
        adminJobsRes.body?.jobs?.some((j) => j._id === createdJobId || j._id?.toString() === createdJobId),
      "Admin retrieves full jobs moderation list"
    );

    // Create a temporary user to test admin deletion and cascade
    const tempUserId = new ObjectId();
    const tempUserToken = "temp_user_token_" + Date.now();
    await db.collection("user").insertOne({
      _id: tempUserId,
      name: "Temporary User",
      email: `temp_${Date.now()}@test.com`,
      role: "seeker",
      createdAt: new Date(),
    });
    await db.collection("session").insertOne({
      userId: tempUserId,
      token: tempUserToken,
      expiresAt: futureExpiry,
    });
    await db.collection("applications").insertOne({
      seekerId: tempUserId.toString(),
      jobId: new ObjectId(createdJobId),
      status: "pending",
      appliedAt: new Date(),
    });

    // Admin deletes user
    const deleteUserRes = await request(`/api/admin/users/${tempUserId.toString()}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    assert(deleteUserRes.status === 200 && deleteUserRes.body?.success === true, "Admin deletes user account successfully");

    // Verify Cascade cleanup
    const userInDb = await db.collection("user").findOne({ _id: tempUserId });
    const sessionInDb = await db.collection("session").findOne({ userId: tempUserId });
    const appInDb = await db.collection("applications").findOne({ seekerId: tempUserId.toString() });
    assert(!userInDb && !sessionInDb && !appInDb, "Cascade cleanup removed user, session, and application records");

    // Admin deletes job
    const deleteJobRes = await request(`/api/admin/jobs/${createdJobId}`, {
      method: "DELETE",
      headers: { Cookie: adminCookie },
    });
    assert(deleteJobRes.status === 200 && deleteJobRes.body?.success === true, "Admin deletes moderated job post");

    const jobInDb = await db.collection("jobs").findOne({ _id: new ObjectId(createdJobId) });
    assert(!jobInDb, "Deleted job is completely removed from database");

  } finally {
    // Cleanup test fixtures
    console.log("\n--- Cleaning Up Test Data ---");
    const testUserIds = [testSeekerId, testRecruiterId, testRecruiter2Id, testAdminId];
    await db.collection("user").deleteMany({ _id: { $in: testUserIds } });
    await db.collection("session").deleteMany({ userId: { $in: testUserIds } });
    await db.collection("companies").deleteMany({ recruiterId: { $in: [testRecruiterId.toString(), testRecruiter2Id.toString()] } });
    await db.collection("jobs").deleteMany({ recruiterId: { $in: [testRecruiterId.toString(), testRecruiter2Id.toString()] } });
    await db.collection("applications").deleteMany({ seekerId: testSeekerId.toString() });
    await db.collection("saved_jobs").deleteMany({ seekerId: testSeekerId.toString() });

    server.close();
    await client.close();
    console.log("✓ Cleanup finished\n");
  }

  console.log("=======================================================");
  console.log(`TEST RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log("=======================================================\n");

  if (failedTests > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error("Test Suite Runtime Error:", err);
  process.exit(1);
});
