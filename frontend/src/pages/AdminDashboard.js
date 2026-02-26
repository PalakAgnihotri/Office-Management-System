import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";
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
function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
  API.get("/dashboard/admin")
    .then(res => setData(res.data))
    .catch(err => {
      console.error("ADMIN DASHBOARD ERROR:", err.response?.data || err);
      setData({}); 
    });
}, []);

  if (!data) return <h2 className="text-black p-4 sm:p-6 lg:p-8">Loading...</h2>;
  const chartData = [
  { name: "Total", value: data.totalTasks ?? 0, color: "#7c3aed" },   // purple
  { name: "Pending", value: data.pendingTasks ?? 0, color: "#ec4899" }, // pink
  { name: "Completed", value: data.completedTasks ?? 0, color: "#14b8a6" }, // teal
  { name: "Overdue", value: data.overdueTasks ?? 0, color: "#ef4444" } // red
];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Total Tasks</p>
    <h2 className="text-3xl font-bold mt-2">{data.totalTasks ?? 0}</h2>
  </div>

  <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Pending</p>
    <h2 className="text-3xl font-bold mt-2">{data.pendingTasks ?? 0}</h2>
  </div>

  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Completed</p>
    <h2 className="text-3xl font-bold mt-2">{data.completedTasks ?? 0}</h2>
  </div>

  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Overdue</p>
    <h2 className="text-3xl font-bold mt-2">{data.overdueTasks ?? 0}</h2>
  </div>
  {/* Graph Section */}
<div className="bg-white p-6 lg:p-8 rounded-2xl shadow-xl mt-8 w-full col-span-full">
  <h2 className="text-2xl font-bold mb-8">Task Statistics</h2>

  <div className="w-full h-[500px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
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

</div>

    </AdminLayout>
  );
}

export default AdminDashboard;
