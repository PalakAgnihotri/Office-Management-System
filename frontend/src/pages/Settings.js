import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

function Settings() {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setDarkMode(!darkMode);
  };

  // Fake logged-in user (replace with real user later)
  const user = {
    name: "Palak",
    email: "palakadmin@gmail.com",
    role: "admin"
  };

  return (
    <AdminLayout>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Settings</h1>
      <p className="text-gray-500 mb-6">Manage your preferences</p>

      {/* THEME CARD */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6 flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-lg">Theme</h2>
          <p className="text-gray-500">
            Current: {darkMode ? "Dark Mode" : "Light Mode"}
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="bg-purple-600 text-white px-5 py-2 rounded-lg"
        >
          {darkMode ? "Switch to Light" : "Switch to Dark"}
        </button>
      </div>

      {/* PROFILE INFO */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <h2 className="font-semibold text-lg mb-4">Profile Information</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Name:</p>
            <p className="font-medium">{user.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Email:</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <div>
            <p className="text-gray-500">Role:</p>
            <p className="font-medium text-purple-600">{user.role}</p>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="font-semibold text-lg mb-2">Notifications</h2>
        <p className="text-gray-500">Email notifications enabled</p>
      </div>
    </AdminLayout>
  );
}

export default Settings;