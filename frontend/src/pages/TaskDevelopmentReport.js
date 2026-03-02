import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function TaskDevelopmentReport() {

  const getToday = () =>
    new Date().toISOString().split("T")[0];

  /* DATE FORMAT */
  const formatDate = (dateString) => {
    if (!dateString) return "-";

    const d = new Date(dateString);

    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    return `${String(d.getDate()).padStart(2,"0")}/${months[d.getMonth()]}/${d.getFullYear()}`;
  };

  /* HOURS FORMAT */
  const formatHours = (mins) => {
    if (!mins && mins !== 0) return "-";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(getToday());
  const [toDate, setToDate] = useState(getToday());

  /* FETCH */
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/development/all");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTasks([]);
    }
  };

  /* FILTER */
  const filtered = tasks.filter(task => {

    const titleMatch =
      task.title?.toLowerCase()
      .includes(search.toLowerCase());

    if (!task.due_date) return false;

    const d = new Date(task.due_date);

    const taskDate =
      `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

    return (
      titleMatch &&
      taskDate >= fromDate &&
      taskDate <= toDate
    );

  });

  /* STATUS COLOR */
  const getStatusColor = (status) => {

    switch (status?.toLowerCase()) {

      case "completed":
        return "bg-green-100 text-green-700";

      case "in-progress":
        return "bg-yellow-100 text-yellow-700";

      case "pending":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }

  };

  /* PRINT */
  const handlePrint = () => {

    const win =
      window.open("", "", "width=900,height=700");

    const rows =
      filtered.map(task => `
<tr>
<td>TD${String(task.id).padStart(3,"0")}</td>
<td>${task.title}</td>
<td>${task.status}</td>
<td>${formatHours(task.allotted_hours)}</td>
<td>${formatDate(task.due_date)}</td>
</tr>
`).join("");

    win.document.write(`
<html>
<head>
<title>Task Development Report</title>
<style>
body{font-family:Arial;padding:20px;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #ddd;padding:8px;}
th{background:#f3f3f3;}
</style>
</head>
<body>

<h2>Task Development Report</h2>

<table>
<thead>
<tr>
<th>ID</th>
<th>Title</th>
<th>Status</th>
<th>Hours</th>
<th>Date</th>
</tr>
</thead>

<tbody>
${rows}
</tbody>

</table>

</body>
</html>
`);

    win.document.close();
    win.print();
  };

  /* EXPORT CSV */
  const handleExportCSV = () => {

    const headers =
      ["ID","Title","Status","Hours","Date"];

    const rows =
      filtered.map(task => [

        `TD${String(task.id).padStart(3,"0")}`,
        task.title,
        task.status,
        formatHours(task.allotted_hours),
        formatDate(task.due_date)

      ]);

    const csv =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows]
      .map(r => r.join(","))
      .join("\n");

    const link =
      document.createElement("a");

    link.href = encodeURI(csv);
    link.download =
      "task_development_report.csv";

    link.click();
  };

  return (

<AdminLayout>

<div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">

{/* TITLE */}
<h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
Task Development Report
</h1>


{/* FILTER CARD */}
<div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 mb-6">

<div className="flex flex-col lg:flex-row gap-4 lg:items-end lg:justify-between">

{/* inputs */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">

<div>
<label className="text-sm text-gray-600">
From
</label>

<input
type="date"
value={fromDate}
onChange={(e)=>setFromDate(e.target.value)}
className="border rounded-lg px-3 py-2 w-full"
/>
</div>


<div>
<label className="text-sm text-gray-600">
To
</label>

<input
type="date"
value={toDate}
onChange={(e)=>setToDate(e.target.value)}
className="border rounded-lg px-3 py-2 w-full"
/>
</div>


<div>
<label className="text-sm text-gray-600">
Search
</label>

<input
value={search}
onChange={(e)=>setSearch(e.target.value)}
placeholder="Search task"
className="border rounded-lg px-3 py-2 w-full"
/>
</div>

</div>


{/* buttons */}
<div className="flex gap-3 w-full sm:w-auto">

<button
onClick={handlePrint}
className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
>
Print
</button>


<button
onClick={handleExportCSV}
className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm w-full sm:w-auto"
>
Export
</button>

</div>

</div>

</div>


{/* TOTAL */}
<div className="text-sm text-gray-500 mb-4">
Total Tasks: {filtered.length}
</div>



{/* ================= MOBILE VIEW ================= */}
<div className="sm:hidden space-y-4">

{filtered.map(task => (

<div
key={task.id}
className="bg-white border rounded-xl shadow p-4"
>

<div className="flex justify-between items-start">

<div>
<h2 className="font-semibold">
{task.title}
</h2>

<p className="text-xs text-gray-500">
ID: TD{String(task.id).padStart(3,"0")}
</p>
</div>

<span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)}`}>
{task.status}
</span>

</div>


<div className="grid grid-cols-2 gap-y-2 mt-3 text-sm">

<div className="text-gray-500">
Hours
</div>

<div className="text-right font-medium">
{formatHours(task.allotted_hours)}
</div>


<div className="text-gray-500">
Date
</div>

<div className="text-right font-medium">
{formatDate(task.due_date)}
</div>

</div>

</div>

))}

</div>



{/* ================= DESKTOP TABLE ================= */}
<div className="hidden sm:block bg-white border rounded-2xl shadow overflow-x-auto">

<table className="w-full text-sm">

<thead className="bg-gray-50">

<tr>

<th className="px-6 py-3 text-left font-semibold">
ID
</th>

<th className="px-6 py-3 text-left font-semibold">
Title
</th>

<th className="px-6 py-3 text-left font-semibold">
Status
</th>

<th className="px-6 py-3 text-left font-semibold">
Hours
</th>

<th className="px-6 py-3 text-left font-semibold">
Date
</th>

</tr>

</thead>


<tbody>

{filtered.map(task => (

<tr key={task.id} className="border-t hover:bg-gray-50">

<td className="px-6 py-3">
TD{String(task.id).padStart(3,"0")}
</td>


<td className="px-6 py-3 font-medium">
{task.title}
</td>


<td className="px-6 py-3">
<span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)}`}>
{task.status}
</span>
</td>


<td className="px-6 py-3">
{formatHours(task.allotted_hours)}
</td>


<td className="px-6 py-3">
{formatDate(task.due_date)}
</td>

</tr>

))}

</tbody>

</table>

</div>


</div>

</AdminLayout>

);

}

export default TaskDevelopmentReport;
