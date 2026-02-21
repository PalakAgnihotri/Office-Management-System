import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AuthLayout from "../components/AuthLayout";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee"
  });

  const handleSignup = async () => {
    try {
      await API.post("/auth/register", form);
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <AuthLayout title="Sign Up">

      {/* Full Name */}
      <input
        type="text"
        placeholder="Full Name"
        className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      {/* Role Selection */}
      <div className="mb-6">
        <p className="font-medium mb-3">Role</p>

        <div className="flex items-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="employee"
              checked={form.role === "employee"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="accent-purple-600"
            />
            <span>Employee</span>
          </label>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="role"
              value="admin"
              checked={form.role === "admin"}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="accent-purple-600"
            />
            <span>Admin</span>
          </label>
        </div>
      </div>

      {/* Email */}
      <input
        type="email"
        placeholder="Email"
        className="w-full p-4 border border-gray-300 rounded-xl mb-6 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        className="w-full p-4 border border-gray-300 rounded-xl mb-8 focus:outline-none focus:ring-2 focus:ring-purple-500"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      {/* Gradient Button */}
      <button
        onClick={handleSignup}
        className="w-full py-4 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition"
      >
        Sign Up →
      </button>

      {/* Switch Link */}
      <p className="text-center mt-6 text-gray-600">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-purple-600 font-medium cursor-pointer"
        >
          Sign in here
        </span>
      </p>

    </AuthLayout>
  );
}
console.log("Signup loaded");

export default Signup;
