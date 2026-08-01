// src/lib/jobs.js
// All functions that call auth-protected backend routes need to forward
// the browser cookie. When called from server components, pass the cookie
// header explicitly. When called from client components (browser), use
// credentials: "include" so the browser sends the cookie automatically.

const API_URL = "http://localhost:5000/api/jobs";

/**
 * createJobService — called from a client component (CreateJobForm),
 * so credentials: "include" forwards the cookie automatically.
 */
const createJobService = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  return await response.json();
};

/**
 * getMyJobsService — called from server components (recruiter overview page).
 * Server-side fetch does NOT auto-send browser cookies, so we accept an
 * optional cookieHeader string and forward it manually.
 */
const getMyJobsService = async (cookieHeader) => {
  try {
    const headers = {};
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const response = await fetch(`${API_URL}/me`, {
      cache: "no-store",
      headers,
    });

    if (!response.ok) {
      return { success: false, jobs: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("Error Fetching Jobs: ", error);
    return { success: false, jobs: [] };
  }
};

/**
 * getJobsService — public, no auth required.
 */
const getJobsService = async () => {
  try {
    const response = await fetch(API_URL, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, jobs: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("Error Fetching Jobs: ", error);
    return { success: false, jobs: [] };
  }
};

/**
 * getJobByIdService — public, no auth required.
 */
const getJobByIdService = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, job: null };
    }

    return await response.json();
  } catch (error) {
    console.error("Error Fetching Job by ID: ", error);
    return { success: false, job: null };
  }
};

module.exports = {
  createJobService,
  getMyJobsService,
  getJobsService,
  getJobByIdService,
};
