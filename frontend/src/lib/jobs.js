const API_URL = "http://localhost:5000/api/jobs";

export const createJobService = async (payload) => {
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

export const getMyJobsService = async (cookieHeader) => {
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

export const getJobsService = async () => {
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

export const getJobByIdService = async (id) => {
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

export const updateJobService = async (id, payload) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error Updating Job: ", error);
    return { success: false, message: "Failed to update job" };
  }
};

export const deleteJobService = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return await response.json();
  } catch (error) {
    console.error("Error Deleting Job: ", error);
    return { success: false, message: "Failed to delete job" };
  }
};
