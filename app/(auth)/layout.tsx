const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen py-20 flex">
      {/* Left Image */}
      <div className="hidden lg:w-1/2 lg:flex bg-gradient-to-br from-pink-400 via-rose-400 to-pink-600 relative">
        <div
          style={{
            backgroundImage:
              "url(https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)",
          }}
          className="absolute inset-0 opacity-20 bg-cover bg-center"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center">
            <h1 className="text-4xl font-bold mb-6">Manage your files</h1>
            <p className="opacity-90 text-xl leading-relaxed">
              Organize, search, and access your files from anywhere. Secure
              cloud storage with an intuitive interface.
            </p>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
};

export default AuthLayout;
