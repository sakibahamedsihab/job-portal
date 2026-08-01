// src/lib/companies.js
// credentials: "include" is required on auth-protected routes when called from client components.
// For Server Components (Next.js server side), pass cookieHeader explicitly so the cookie is forwarded.

const API_URL = "http://localhost:5000/api/companies";

export const createCompanyService = async (companyData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include", // send cookie to backend from client component
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    return await response.json();
  } catch (error) {
    console.error("Frontend Error (createCompanyService):", error);
    return { success: false, message: "Network error occurred." };
  }
};

export const getCompaniesService = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      cache: "no-store",
    });

    return await response.json();
  } catch (error) {
    console.error("Frontend Error (getCompaniesService):", error);
    return { success: false, data: [] };
  }
};

export const getMyCompanyService = async (cookieHeader) => {
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
      return { success: false, company: null };
    }

    return await response.json();
  } catch (error) {
    console.error("Error Fetching Company: ", error);
    return { success: false, company: null };
  }
};
