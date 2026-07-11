const API_URL = "http://localhost:5000/api/jobs";

const createJobService = async (payload) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
};

const getMyJobsService = async () => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return { success: false, Jobs: null };
    }

    return await response.json();
  } catch (error) {
    console.error("Error Fetching Jobs: ", error);
    return { success: false, Jobs: null };
  }
};

module.exports = {
  createJobService,
  getMyJobsService,
};
