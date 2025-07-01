import { getDbUserId } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import DashboardPageClient from "./_components/DashboardPageClient";

const DashboardPage = async () => {
  const userId = await getDbUserId();
  if (!userId) redirect("/login");
  return <DashboardPageClient />;
};

export default DashboardPage;
