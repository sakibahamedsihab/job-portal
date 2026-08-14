const API_URL = "http://localhost:5000/api/admin";

export const getAdminStatsService = async (cookieHeader) => {
  try {
    const headers = {};
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const response = await fetch(`${API_URL}/stats`, {
      cache: "no-store",
      credentials: "include",
      headers,
    });

    if (!response.ok) return { success: false, stats: null };
    return await response.json();
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return { success: false, stats: null };
  }
};

export const getAdminUsersService = async (cookieHeader) => {
  try {
    const headers = {};
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const response = await fetch(`${API_URL}/users`, {
      cache: "no-store",
      credentials: "include",
      headers,
    });

    if (!response.ok) return { success: false, users: [] };
    return await response.json();
  } catch (error) {
    console.error("Error fetching admin users:", error);
    return { success: false, users: [] };
  }
};

export const getAdminJobsService = async (cookieHeader) => {
  try {
    const headers = {};
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const response = await fetch(`${API_URL}/jobs`, {
      cache: "no-store",
      credentials: "include",
      headers,
    });

    if (!response.ok) return { success: false, jobs: [] };
    return await response.json();
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    return { success: false, jobs: [] };
  }
};

export const deleteJobAdminService = async (jobId) => {
  try {
    const response = await fetch(`${API_URL}/jobs/${jobId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting job:", error);
    return { success: false, message: "Network error occurred." };
  }
};

export const deleteUserAdminService = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, message: "Network error occurred." };
  }
};
