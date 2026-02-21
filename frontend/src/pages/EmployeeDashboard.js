import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../layouts/EmployeeLayout";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks/my-tasks", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    setTasks(res.data);
  };

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "pending").length;
  const completed = tasks.filter(t => t.status === "completed").length;
  const overdue = tasks.filter(
    t => new Date(t.deadline) < new Date() && t.status !== "completed"
  ).length;

  return (
    <EmployeeLayout>
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Tasks" value={total} color="purple" />
        <Card title="Pending" value={pending} color="pink" />
        <Card title="Completed" value={completed} color="green" />
        <Card title="Overdue" value={overdue} color="red" />
      </div>
    </EmployeeLayout>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-lg bg-${color}-500 text-white`}>
      <h2>{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}

export default EmployeeDashboard;

