import { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiClipboard,
  FiUsers,
  FiSettings,
  FiFileText,
  FiTruck,
  FiLogOut,
  FiChevronDown,
  FiCreditCard,
  FiUser,
  FiX
} from "react-icons/fi";

function Sidebar({ role, onLogout, closeSidebar }) {
  const [openReports, setOpenReports] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => {
    navigate(path);
    if (closeSidebar) closeSidebar(); // close on mobile
  };

  const linkStyle =
    "flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition hover:bg-purple-100 hover:text-purple-600";

  const activeStyle = "bg-purple-600 text-white";

  return (
    <div className="h-full flex flex-col bg-white">

      {/* HEADER */}
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          Taskify 🛩️
        </h2>

        {/* Close button mobile */}
        <button className="md:hidden" onClick={closeSidebar}>
          <FiX size={22} />
        </button>
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 text-gray-700 font-medium">

        {role === "admin" && (
          <>
            <div
              onClick={() => handleNavigate("/admin")}
              className={`${linkStyle} ${
                location.pathname === "/admin" && activeStyle
              }`}
            >
              <FiHome /> Dashboard
            </div>

            <div onClick={() => handleNavigate("/task-entry")} className={linkStyle}>
              <FiClipboard /> Task Entry
            </div>

            <div onClick={() => handleNavigate("/task-allotment")} className={linkStyle}>
              <FiUsers /> Task Allotment
            </div>

            <div onClick={() => handleNavigate("/task-development")} className={linkStyle}>
              <FiFileText /> Task Development
            </div>

            <div onClick={() => handleNavigate("/courier-inward")} className={linkStyle}>
              <FiTruck /> Courier Inward
            </div>

            <div onClick={() => handleNavigate("/courier-outward")} className={linkStyle}>
              <FiTruck /> Courier Outward
            </div>

            <div onClick={() => handleNavigate("/notes")} className={linkStyle}>
              <FiFileText /> Notes
            </div>

            <div onClick={() => handleNavigate("/cheque-payments")} className={linkStyle}>
              <FiCreditCard /> Cheque Payments
            </div>

            <div onClick={() => handleNavigate("/employee-master")} className={linkStyle}>
              <FiUsers /> Employee Master
            </div>

            {/* REPORTS */}
            <div>
              <button
                onClick={() => setOpenReports(!openReports)}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-purple-50"
              >
                <span className="flex gap-3 items-center">
                  <FiFileText /> Reports
                </span>
                <FiChevronDown
                  className={`transition ${openReports ? "rotate-180" : ""}`}
                />
              </button>

              {openReports && (
                <div className="ml-8 flex flex-col gap-1 mt-1">
                  <NavLink
                    to="/admin/reports/cheques"
                    className="px-2 py-1 rounded hover:bg-purple-50"
                    onClick={closeSidebar}
                  >
                    Cheque Report
                  </NavLink>

                  <NavLink
                    to="/admin/reports/courier-inward"
                    className="px-2 py-1 rounded hover:bg-purple-50"
                    onClick={closeSidebar}
                  >
                    Courier Inward Report
                  </NavLink>

                  <NavLink
                    to="/admin/reports/courier-outward"
                    className="px-2 py-1 rounded hover:bg-purple-50"
                    onClick={closeSidebar}
                  >
                    Courier Outward Report
                  </NavLink>

                  <NavLink
                    to="/admin/reports/notes"
                    className="px-2 py-1 rounded hover:bg-purple-50"
                    onClick={closeSidebar}
                  >
                    Notes Report
                  </NavLink>
                  <NavLink
                    to="/admin/reports/task-development-report"
                    className="px-2 py-1 rounded hover:bg-purple-50"
                    onClick={closeSidebar}
                  >
                    Task Development Report
                  </NavLink>

                </div>
              )}
            </div>

            <div onClick={() => handleNavigate("/settings")} className={linkStyle}>
              <FiSettings /> Settings
            </div>
          </>
        )}

        {role === "employee" && (
          <>
            <div onClick={() => handleNavigate("/employee")} className={linkStyle}>
              <FiHome /> Dashboard
            </div>

            <div onClick={() => handleNavigate("/my-tasks")} className={linkStyle}>
              <FiClipboard /> My Tasks
            </div>
            <div onClick={() => handleNavigate("/employee/development")} className={linkStyle}>
              <FiClipboard /> Task Development
            </div>

            <div onClick={() => handleNavigate("/employees/report")} className={linkStyle}>
              <FiFileText /> Report
            </div>

            <div onClick={() => handleNavigate("/employees/profile")} className={linkStyle}>
              <FiUser /> Profile
            </div>
          </>
        )}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button
          onClick={onLogout}
          className="flex items-center justify-center gap-2 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
        >
          <FiLogOut /> Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
