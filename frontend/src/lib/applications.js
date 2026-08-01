// src/lib/applications.js
//
// Frontend service layer for the applications API.
// These functions are thin wrappers around fetch() that talk to
// the Express backend at http://localhost:5000/api/applications.
//
// Separation of concerns: UI components never call fetch() directly —
// they import from here. This means if the API URL changes, we only
// update it in one place.
//
// ─── Why credentials: "include"? ─────────────────────────────────────────────
// The browser stores the session as a cookie (better-auth.session_token).
// By default, fetch() does NOT send cookies to cross-origin servers.
// credentials: "include" tells the browser to always attach the cookie,
// which lets the Express requireAuth middleware validate the session.
// ─────────────────────────────────────────────────────────────────────────────

const API_URL = "http://localhost:5000/api/applications";

// ─────────────────────────────────────────────────────────────────────────────
// applyToJobService
//
// Called when a SEEKER clicks "Apply" on the job detail page.
// Sends a POST request with the jobId in the body.
// The backend will:
//   - verify the session (who is applying)
//   - check the job exists
//   - prevent duplicate applications
//   - insert the application document
//
// Returns: { success: true, applicationId: "..." }
//       or { success: false, message: "..." }
// ─────────────────────────────────────────────────────────────────────────────
export const applyToJobService = async (jobId) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include", // send the session cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error applying to job:", error);
    return { success: false, message: "Network error. Please try again." };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getMyApplicationsService
//
// Called from server components (applied-jobs page, seeker overview).
// Fetches all applications submitted by the currently logged-in seeker.
//
// Since this is called from server components, cookies are NOT automatically
// forwarded. Pass the raw cookie string (from next/headers cookies()) as
// cookieHeader and it will be forwarded manually via the "Cookie" header.
//
// Returns: { success: true, applications: [...] }
//       or { success: false, applications: [] }
// ─────────────────────────────────────────────────────────────────────────────
export const getMyApplicationsService = async (cookieHeader) => {
  try {
    const headers = {};
    if (cookieHeader) {
      // Forward the browser cookie from Next.js server to the Express backend.
      // Without this, the backend receives no cookie and returns 401.
      headers["Cookie"] = cookieHeader;
    }

    const response = await fetch(`${API_URL}/me`, {
      cache: "no-store", // always fetch fresh data, never use cached response
      headers,
    });

    if (!response.ok) {
      return { success: false, applications: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching my applications:", error);
    return { success: false, applications: [] };
  }
};
