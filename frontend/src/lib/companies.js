// src/lib/companies.js

import { success } from "better-auth";

const API_URL = "http://localhost:5000/api/companies";

// POST: নতুন কোম্পানি তৈরি করার সার্ভিস
export const createCompanyService = async (companyData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
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

// GET: ডাটাবেস থেকে সব কোম্পানি তুলে আনার সার্ভিস
export const getCompaniesService = async () => {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
    });

    return await response.json();
  } catch (error) {
    console.error("Frontend Error (getCompaniesService):", error);
    return { success: false, data: [] };
  }
};

export const getMyCompanyService = async () => {
  try {
    const response = await fetch(`${API_URL}/me`, {
      cache: "no-store",
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
