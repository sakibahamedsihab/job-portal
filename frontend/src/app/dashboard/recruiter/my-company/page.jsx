import { cookies } from "next/headers";
import CompanyDisplay from "./CompanyDisplay";
import { getMyCompanyService } from "@/lib/companies";

export default async function MyCompanyPage() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const response = await getMyCompanyService(cookieHeader);

  const company = response?.company || null;

  return <CompanyDisplay company={company} />;
}
