import { getDbUserId } from "@/lib/getCurrentUser";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const userId = await getDbUserId();
  if (!userId) redirect("/login");
  return <div>DashboardPage</div>;
};

export default DashboardPage;
