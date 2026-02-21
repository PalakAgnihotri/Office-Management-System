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
  ResponsiveContainer
} from "recharts";
function AdminDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/dashboard/admin")
      .then(res => setData(res.data))
      .catch(err => console.log(err));
  }, []);

  if (!data) return <h2 className="text-black p-8">Loading...</h2>;
  const chartData = [
  { name: "Total", value: data.totalTasks },
  { name: "Pending", value: data.pendingTasks },
  { name: "Completed", value: data.completedTasks },
  { name: "Overdue", value: data.overdueTasks }
];

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Total Tasks</p>
    <h2 className="text-3xl font-bold mt-2">{data.totalTasks}</h2>
  </div>

  <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Pending</p>
    <h2 className="text-3xl font-bold mt-2">{data.pendingTasks}</h2>
  </div>

  <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Completed</p>
    <h2 className="text-3xl font-bold mt-2">{data.completedTasks}</h2>
  </div>

  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-2xl shadow-lg">
    <p className="text-sm opacity-80">Overdue</p>
    <h2 className="text-3xl font-bold mt-2">{data.overdueTasks}</h2>
  </div>
  {/* Graph Section */}
<div className="bg-white p-8 rounded-2xl shadow-xl mt-12 w-full">
  <h2 className="text-2xl font-bold mb-8">Task Statistics</h2>

  <div className="w-full h-[400px]">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis dataKey="name" tick={{ fontSize: 14 }} />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar
          dataKey="value"
          fill="#7c3aed"
          radius={[8, 8, 0, 0]}
          barSize={60}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

</div>

    </AdminLayout>
  );
}

export default AdminDashboard;
