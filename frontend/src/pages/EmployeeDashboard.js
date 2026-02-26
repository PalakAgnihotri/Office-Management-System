import { useEffect, useState } from "react";
import API from "../services/api";
import EmployeeLayout from "../layouts/EmployeeLayout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

function EmployeeDashboard() {
  const [tasks, setTasks] = useState([]);
  


  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("FETCH TASK ERROR:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const completed = tasks.filter(t => t.status === "Completed").length;
  const overdue = tasks.filter(
    t => new Date(t.due_date) < new Date() && t.status !== "Completed"
  ).length;

  const chartData = [
  { name: "Total", value: total, color: "#7c3aed" },
  { name: "Pending", value: pending, color: "#ec4899" },
  { name: "Completed", value: completed, color: "green" },
  { name: "Overdue", value: overdue, color: "red" }
];
  return (
    <EmployeeLayout>
      <h1 className="text-3xl font-bold mb-8">My Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card title="Total Tasks" value={total} color="purple" />
        <Card title="Pending" value={pending} color="blue" />
        <Card title="Completed" value={completed} color="green" />
        <Card title="Overdue" value={overdue} color="red" />
      </div>

      {/* Graph */}
      <div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl mt-8 w-full">
        <h2 className="text-2xl font-bold mb-6">Task Statistics</h2>

        <div className="w-full h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={80}>
  {chartData.map((entry, index) => (
    <Cell key={`cell-${index}`} fill={entry.color} />
  ))}
</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </EmployeeLayout>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-6 rounded-xl shadow-lg bg-${color}-500 text-white`}>
      <h2>{title}</h2>
      <p className="text-xl sm:text-2xl lg:text-3xl font-bold">{value}</p>
    </div>
  );
}

export default EmployeeDashboard;