import AuthFormFormHeaders from "../_components/AuthFormFormHeaders";
import LoginPageClient from "./_components/LoginPageClient";

const LoginPage = () => {
  return (
    <div className="w-full lg:w-1/2 p-8 flex justify-center items-center bg-gradient-to-br from-pink-50 to-rose-50 ">
      <div className="max-w-md w-full">
        <div className="p-8 bg-white rounded-2xl border border-pink-100 shadow-xl ">
          <AuthFormFormHeaders
            title="Create Account"
            subtitle="Get started with secure file storage"
          />
          <LoginPageClient />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
