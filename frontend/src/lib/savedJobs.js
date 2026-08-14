const API_URL = "http://localhost:5000/api/saved-jobs";

export const toggleSaveJobService = async (jobId) => {
  try {
    const response = await fetch(`${API_URL}/toggle`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jobId }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error toggling saved job:", error);
    return { success: false, message: "Network error occurred." };
  }
};

export const getMySavedJobsService = async (cookieHeader) => {
  try {
    const headers = {};
    if (cookieHeader) {
      headers["Cookie"] = cookieHeader;
    }

    const response = await fetch(`${API_URL}/me`, {
      cache: "no-store",
      credentials: "include",
      headers,
    });

    if (!response.ok) {
      return { success: false, savedJobs: [] };
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return { success: false, savedJobs: [] };
  }
};

export const checkIsJobSavedService = async (jobId) => {
  try {
    const response = await fetch(`${API_URL}/check/${jobId}`, {
      credentials: "include",
    });

    if (!response.ok) {
      return { success: false, isSaved: false };
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking saved job:", error);
    return { success: false, isSaved: false };
  }
};
