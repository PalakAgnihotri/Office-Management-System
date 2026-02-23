import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

function EmployeeLayout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen">

      <Sidebar
        role="employee"
        onLogout={handleLogout}
      />

      <div className="flex-1 bg-gray-100 p-4 sm:p-6 lg:p-8">
        {children}
      </div>

    </div>
  );
}

export default EmployeeLayout;
