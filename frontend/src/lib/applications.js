// src/lib/applications.js
//
// Frontend service layer for the applications API.
// These functions are thin wrappers around fetch() that talk to
// the Express backend at http://localhost:5000/api/applications.

const API_URL = "http://localhost:5000/api/applications";

// ─────────────────────────────────────────────────────────────────────────────
// applyToJobService
// Called when a SEEKER clicks "Apply" on the job detail page.
// ─────────────────────────────────────────────────────────────────────────────
export const applyToJobService = async (jobId) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
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
// Called from seeker server components (applied-jobs page, seeker overview).
// ─────────────────────────────────────────────────────────────────────────────
export const getMyApplicationsService = async (cookieHeader) => {
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
      return { success: false, applications: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching my applications:", error);
    return { success: false, applications: [] };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// getJobApplicantsService
// Called from recruiter server components (Applicants page).
// ─────────────────────────────────────────────────────────────────────────────
export const getJobApplicantsService = async (jobId, cookieHeader) => {
  try {
    const headers = {};
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const response = await fetch(`${API_URL}/job/${jobId}`, {
      cache: "no-store",
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message: errorData.message || "Failed to fetch applicants.",
        applicants: [],
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching job applicants:", error);
    return {
      success: false,
      message: "Network error occurred.",
      applicants: [],
    };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// updateApplicationStatusService
//
// Called from recruiter client components (ApplicationStatusSelector).
// Sends a PATCH request to change candidate application status.
//
// Parameters:
//   - applicationId: The ID of the application document
//   - status: New status string ("pending" | "reviewing" | "accepted" | "rejected")
//
// Returns: { success: true, message: "...", status: "..." }
// ─────────────────────────────────────────────────────────────────────────────
export const updateApplicationStatusService = async (applicationId, status) => {
  try {
    const response = await fetch(`${API_URL}/${applicationId}/status`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, message: "Network error occurred." };
  }
};
