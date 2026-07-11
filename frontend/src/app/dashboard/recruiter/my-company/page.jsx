import CompanyDisplay from "./CompanyDisplay";
import { getMyCompanyService } from "@/lib/companies";

export default async function MyCompanyPage() {
  const response = await getMyCompanyService();

  const company = response?.company || null;

  return <CompanyDisplay company={company} />;
}
