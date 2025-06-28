import { getDbUserId } from "@/lib/getCurrentUser";
import AuthFormFormHeaders from "../_components/AuthFormFormHeaders";
import OptPageClient from "./_components/OptPageClient";
import { redirect } from "next/navigation";

interface OtpPageProps {
  searchParams: Promise<{ [key: string]: string }>;
}

const OtpPage = async ({ searchParams }: OtpPageProps) => {
  const userId = await getDbUserId();
  if (userId) redirect("/dashboard");
  const { username, email, otpId, type } = await searchParams;
  return (
    <div className="w-full lg:w-1/2 p-8 flex justify-center items-center bg-gradient-to-br from-pink-50 to-rose-50 ">
      <div className="max-w-md w-full">
        <div className="p-8 bg-white rounded-2xl border border-pink-100 shadow-xl ">
          <AuthFormFormHeaders
            title="Verify Your Email"
            subtitle="Enter the verification code we sent you"
          />
          <OptPageClient
            username={username}
            email={email}
            otpId={otpId}
            type={type}
          />
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
