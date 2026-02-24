import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import MyTasks from "./pages/MyTasks";
import TaskEntry from "./pages/TaskEntry";
import TaskAllotment from "./pages/TaskAllotment";
import TaskDevelopment from "./pages/TaskDevelopment";
import CourierInward from "./pages/CourierInward";
import CourierOutward from "./pages/CourierOutward";
import Notes from "./pages/Notes";
import Reports from "./pages/Reports";
import ChequePayments from "./pages/ChequePayments";
import EmployeeMaster from "./pages/EmployeeMaster";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployeeProfile from "./pages/EmployeeProfile";
import NotesReport from "./pages/NotesReport";
import ChequeReport from "./pages/ChequeReport";
import CourierInwardReport from "./pages/CourierInwardReport";
import CourierOutwardReport from "./pages/CourierOutwardReport";
import DevelopmentReport from "./pages/DevelopmentReport";
import EmployeeTaskDevelopment from "./pages/EmployeeTaskDevelopment"

function App() {
  return (
    <Router>
      <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />

  <Route
    path="/admin"
    element={
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/employee"
    element={
      <ProtectedRoute role="employee">
        <EmployeeDashboard />
      </ProtectedRoute>
    }
  />

  <Route path="/my-tasks" element={<MyTasks />} />
  <Route path="/task-entry" element={<TaskEntry />} />
  <Route path="/task-allotment" element={<TaskAllotment />} />
  <Route path="/task-development" element={<TaskDevelopment />} />
  <Route path="/courier-inward" element={<CourierInward />} />
  <Route path="/courier-outward" element={<CourierOutward />} />
  <Route path="/notes" element={<Notes />} />
  <Route path="/reports" element={<Reports />} />
  <Route path="/cheque-payments" element={<ChequePayments />} />
  <Route path="/employee-master" element={<EmployeeMaster />} />
  <Route path="/settings" element={<Settings />} />
  <Route path="/employees/profile" element={<EmployeeProfile />} />
  <Route path="/employees/report" element={<DevelopmentReport />} />

  <Route
  path="/employee/development"
  element={
    <ProtectedRoute role="employee">
      <EmployeeTaskDevelopment />
    </ProtectedRoute>
  }
/>

  <Route path="/admin/reports/cheques" element={<ChequeReport />} />
  <Route path="/admin/reports/courier-inward" element={<CourierInwardReport />} />
  <Route path="/admin/reports/courier-outward" element={<CourierOutwardReport />} />
  <Route path="/admin/reports/notes" element={<NotesReport />} />
</Routes>
    </Router>
  );
}

export default App;
