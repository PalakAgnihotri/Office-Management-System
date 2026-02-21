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
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/task-entry" element={<TaskEntry />} />
        <Route path="/task-allotment" element={<TaskAllotment />}/>
        <Route path="/task-development" element={<TaskDevelopment />} />
        <Route path="/courier-inward" element={<CourierInward />}/>
        <Route path="/courier-outward" element={<CourierOutward />}/>
        <Route path="/notes" element ={<Notes />}/>
        <Route path="/reports" element ={<Reports />}/>
        <Route path="/cheque-payments" element={<ChequePayments />}/>
        <Route path="/employee-master" element={<EmployeeMaster />} />
        <Route path="/settings" element={<Settings />}/>
      </Routes>
    </Router>
  );
}

export default App;
