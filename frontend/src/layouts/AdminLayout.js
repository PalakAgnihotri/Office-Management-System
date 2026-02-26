import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

function AdminLayout({ children }) {
  const role = localStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between bg-white shadow px-4 py-3">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white px-3 py-2 rounded"
        >
          ☰
        </button>

        <h1 className="text-purple-600 font-bold">
          Taskify
        </h1>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          role={role}
          onLogout={handleLogout}
          closeSidebar={() => setIsOpen(false)}
        />
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Content */}
      <div className="p-4 sm:p-6 md:p-8">
        {children}
      </div>

    </div>
  );
}

export default AdminLayout;
