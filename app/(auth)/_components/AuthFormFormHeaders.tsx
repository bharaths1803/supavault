interface AuthFormFormHeadersProps {
  title: string;
  subtitle: string;
}

const AuthFormFormHeaders = ({ title, subtitle }: AuthFormFormHeadersProps) => {
  return (
    <div className="text-center mb-8">
      <div className="mb-4 mx-auto flex justify-center items-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 h-16 w-16">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 5a2 2 0 012-2h4a2 2 0 012 2v3H8V5z"
          />
        </svg>
      </div>
      <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-rose-600">
        {title}
      </h2>
      <p className="text-gray-900">{subtitle}</p>
    </div>
  );
};

export default AuthFormFormHeaders;
