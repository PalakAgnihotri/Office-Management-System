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

      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-white shadow px-4 py-3">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-purple-600 text-white p-2 rounded"
        >
          ☰
        </button>
        <h1 className="text-purple-600 font-bold">TaskFlow</h1>
      </div>

      <div className="flex flex-row w-full">

        {/* Sidebar */}
        <div className={`
  fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50
  transform transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"}
  md:relative md:translate-x-0 md:block
`}>
          <Sidebar
            role={role}
            onLogout={handleLogout}
            closeSidebar={() => setIsOpen(false)}
          />
        </div>

        {/* Overlay for mobile */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 w-full p-4 sm:p-6 md:p-8 overflow-x-hidden">
          {children}
        </div>

      </div>
    </div>
  );
}

export default AdminLayout;