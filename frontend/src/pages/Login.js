import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });
    const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
  try {
    setLoading(true);   // start loading
      setError("");
    const res = await API.post("/auth/login", form);

    console.log("LOGIN RESPONSE:", res.data);  

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);

    console.log("STORED ROLE:", res.data.user.role); 

    if (res.data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/employee");
    }

  } catch (err) {
    alert("Invalid credentials");
  } finally{
    setLoading(false);
  }

};

  return (
    <AuthLayout title="Login">

      <input
        type="email"
        placeholder="Email"
        className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full p-4 border border-gray-300 rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
  onClick={handleLogin}
  disabled={loading}
  className="w-full py-4 rounded-full text-white font-semibold text-lg 
  bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition
  flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
>
  {loading ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      Logging in...
    </>
  ) : (
    "Login"
  )}
</button>

      <p className="text-center mt-6 text-gray-600">
        Don’t have an account?{" "}
        <span
          onClick={() => navigate("/signup")}
          className="text-purple-600 font-medium cursor-pointer"
        >
          Sign up here
        </span>
      </p>

    </AuthLayout>
  );
}

export default Login;

