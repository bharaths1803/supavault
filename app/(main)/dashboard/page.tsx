import { getDbUserId } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";
import DashboardPageClient from "./_components/DashboardPageClient";
import { getFiles } from "@/actions/file.actions";

const DashboardPage = async () => {
  const userId = await getDbUserId();
  if (!userId) redirect("/login");
  const userFiles = await getFiles();
  return <DashboardPageClient userFiles={userFiles} />;
};

export default DashboardPage;
