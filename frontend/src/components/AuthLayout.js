function AuthLayout({ title, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">

        <h1 className="text-4xl font-bold text-center mb-8">
          {title}
          <span className="block h-1 w-16 bg-purple-500 mx-auto mt-2 rounded"></span>
        </h1>

        {children}

      </div>

    </div>
  );
}

export default AuthLayout;
