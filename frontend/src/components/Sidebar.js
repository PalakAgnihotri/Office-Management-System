import {useState} from "react";
import { useNavigate } from "react-router-dom";
import {NavLink} from "react-router-dom";
function Sidebar({ role, onLogout, closeSidebar }) {
  const [openReports, setOpenReports] = useState(false);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
    if (closeSidebar) closeSidebar();
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100 p-6">

      <h2 className="text-2xl font-bold text-purple-600 mb-10">
        TaskFlow
      </h2>

      <ul className="space-y-4 text-gray-700 font-medium">

        {/* ================= ADMIN SIDEBAR ================= */}
        {role === "admin" && (
          <>
            <li onClick={() => handleNavigate("/admin")} className="hover:text-purple-600 cursor-pointer">
              Dashboard
            </li>

            <li onClick={() => handleNavigate("/task-entry")} className="hover:text-purple-600 cursor-pointer">
              Task Entry
            </li>

            <li onClick={() => handleNavigate("/task-allotment")} className="hover:text-purple-600 cursor-pointer">
              Task Allotment
            </li>

            <li onClick={() => handleNavigate("/task-development")} className="hover:text-purple-600 cursor-pointer">
              Task Development
            </li>

            <li onClick={() => handleNavigate("/courier-inward")} className="hover:text-purple-600 cursor-pointer">
              Courier Inward
            </li>

            <li onClick={() => handleNavigate("/courier-outward")} className="hover:text-purple-600 cursor-pointer">
              Courier Outward
            </li>

            <li onClick={() => handleNavigate("/notes")} className="hover:text-purple-600 cursor-pointer">
              Notes
            </li>
            

            
            

            <li onClick={() => handleNavigate("/cheque-payments")} className="hover:text-purple-600 cursor-pointer">
              Cheque Payments
            </li>

            <li onClick={() => handleNavigate("/employee-master")} className="hover:text-purple-600 cursor-pointer">
              Employee Master
            </li>
            <button onClick={() => setOpenReports(!openReports)} className="w-full text-left rounded hover:bg-gray-100 font-medium">
              Reports ▾ 
            </button>
            {openReports &&(
              <div className="ml-4 mt-2 space-y-2 text-sm">
                <NavLink to="/admin/reports/cheques" className="block hover:text-purple-600">
                Cheque Report
              </NavLink>

              <NavLink to="/admin/reports/courier-inward" className="block hover:text-purple-600">
                Courier Inward Report
              </NavLink>

              <NavLink to="/admin/reports/courier-outward" className="block hover:text-purple-600">
                Courier Outward Report
              </NavLink>
              <NavLink to="/admin/reports/notes" className="block hover:text-purple-600">
                Notes Report
              </NavLink>
                

              </div>

            )}

            <li onClick={() => handleNavigate("/settings")} className="hover:text-purple-600 cursor-pointer">
              Settings
            </li>
          </>
        )}

        {/* ================= EMPLOYEE SIDEBAR ================= */}
        {role === "employee" && (
          <>
            <li onClick={() => handleNavigate("/employee")} className="hover:text-purple-600 cursor-pointer">
              Dashboard
            </li>

            <li onClick={() => handleNavigate("/my-tasks")} className="hover:text-purple-600 cursor-pointer">
              My Tasks
            </li>
            <li onClick={()=> handleNavigate("/employees/report")} className="hover:text-purple-600 cursor-pointer"> Report</li>
            <li onClick={()=>handleNavigate("/employees/profile")} className="hover:text-purple-600 cursor-pointer">
              My Profile
            </li>
          </>
        )}

      </ul>

      {/* Logout (Common for Both) */}
      <div className="mt-auto">
        <button
          onClick={onLogout}
          className=" bg-red-500 text-white py-2 px-6 rounded-lg">
<<<<<<< HEAD
        >
=======
>>>>>>> 93a4e9b (changes don)
          Logout
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
