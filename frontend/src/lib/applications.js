const API_URL = "http://localhost:5000/api/applications";

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
