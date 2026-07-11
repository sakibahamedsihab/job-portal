// src/app/dashboard/recruiter/my-company/page.jsx
import CompanyDisplay from "./CompanyDisplay";
import { getMyCompanyService } from "@/lib/companies";

export default async function MyCompanyPage() {
  // lib থেকে সরাসরি সার্ভিস কল করে ডাটা নিয়ে আসছি
  const response = await getMyCompanyService();

  // যদি রেসপন্সে কোম্পানি থাকে, তাহলে সেটা পাঠাবো, নাহলে null
  const company = response?.company || null;

  return <CompanyDisplay company={company} />;
}
