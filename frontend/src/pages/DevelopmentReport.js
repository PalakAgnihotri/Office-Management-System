import { useEffect, useState } from "react";
import API from "../services/api";
import EmployeeLayout from "../layouts/EmployeeLayout";

function DevelopmentReport() {

  const getToday = () =>
    new Date().toISOString().split("T")[0];

  const [tasks, setTasks] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(getToday());
  const [toDate, setToDate] = useState(getToday());

  useEffect(() => {
    fetchTasks();
    fetchMyTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/employee-development/my");

      if (Array.isArray(res.data)) {
        setTasks(res.data);
      } else if (Array.isArray(res.data.tasks)) {
        setTasks(res.data.tasks);
      } else {
        setTasks([]);
      }

    } catch {
      setTasks([]);
    }
  };

  const fetchMyTasks = async () => {
    try {
      const res = await API.get("/tasks/my-tasks");
      setMyTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      setMyTasks([]);
    }
  };

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

  /* FILTER */
  const filtered =
    tasks.filter(task => {

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

  const filteredMyTasks =
    myTasks.filter(task => {

      if (!task.work_date) return false;

      const titleMatch =
        task.title?.toLowerCase()
        .includes(search.toLowerCase());

      const d = new Date(task.work_date);

      const taskDate =
        `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;

      return (
        titleMatch &&
        taskDate >= fromDate &&
        taskDate <= toDate
      );

    });

  const combinedTasks = [

    ...filtered.map(task => ({
      ...task,
      displayDate: task.due_date
    })),

    ...filteredMyTasks.map(task => ({
      ...task,
      displayDate: task.work_date
    }))

  ];

  /* PRINT */
  const handlePrint = () => {

    const win =
      window.open("", "", "width=900,height=700");

    const rows =
      combinedTasks.map(task => `
<tr>
<td>TD${String(task.id).padStart(3,"0")}</td>
<td>${task.title || ""}</td>
<td>${task.status || ""}</td>
<td>${
  task.allotted_hours
    ? `${Math.floor(task.allotted_hours/60)}h ${task.allotted_hours%60}m`
    : "-"
}</td>
<td>${formatDate(task.displayDate)}</td>
</tr>
`).join("");

    win.document.write(`
<html>
<head>
<title>Development Report</title>
<style>
body{font-family:Arial;padding:20px;}
table{width:100%;border-collapse:collapse;}
th,td{border:1px solid #ddd;padding:8px;}
th{background:#f3f3f3;}
</style>
</head>
<body>

<h2>Development Tasks Report</h2>

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
      combinedTasks.map(task => [

        `TD${String(task.id).padStart(3,"0")}`,
        task.title,
        task.status,

        task.allotted_hours
          ? `${Math.floor(task.allotted_hours/60)}h ${task.allotted_hours%60}m`
          : "-",

        formatDate(task.displayDate)

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
      "development_report.csv";

    link.click();
  };

  /* STATUS COLOR */
  const getStatusColor = (status) => {

    switch(status?.toLowerCase()) {

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

  return (

<EmployeeLayout>

<div className="max-w-6xl mx-auto">

<h1 className="text-xl sm:text-2xl font-bold mb-6">
Development Tasks Report
</h1>

{/* FILTER CARD */}
<div className="bg-white border rounded-2xl p-4 sm:p-6 shadow mb-6">

<div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

<div className="flex flex-wrap items-end gap-4">

<div>
<label className="text-sm text-gray-600">
From
</label>
<input
type="date"
value={fromDate}
onChange={(e)=>setFromDate(e.target.value)}
className="border rounded-lg px-3 py-2 text-sm w-[160px]"
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
className="border rounded-lg px-3 py-2 text-sm w-[160px]"
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
className="border rounded-lg px-3 py-2 text-sm w-[220px]"
/>
</div>

</div>

<div className="flex gap-3">

<button
onClick={handlePrint}
className="bg-red-700 text-white px-5 py-2 rounded-lg text-sm"
>
Print
</button>

<button
onClick={handleExportCSV}
className="bg-green-600 text-white px-5 py-2 rounded-lg text-sm"
>
Export
</button>

</div>

</div>

</div>

<div className="text-sm text-gray-500 mb-2">
Total Tasks: {combinedTasks.length}
</div>

{/* MOBILE */}
<div className="sm:hidden space-y-4">

{combinedTasks.map(task => (

<div
key={task.id}
className="border rounded-xl p-4 shadow bg-white"
>

<div className="flex justify-between">

<h2 className="font-semibold">
{task.title}
</h2>

<span
className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)}`}
>
{task.status}
</span>

</div>

<div className="text-sm mt-2 space-y-1">

<div>
Hours:
{task.allotted_hours
? `${Math.floor(task.allotted_hours/60)}h ${task.allotted_hours%60}m`
: "-"
}
</div>

<div>
Date: {formatDate(task.displayDate)}
</div>

</div>

</div>

))}

</div>

{/* DESKTOP */}
<div className="hidden sm:block overflow-x-auto bg-white rounded-xl shadow">

<table className="w-full">

<thead className="bg-gray-50">

<tr>
<th className="p-3 text-left text-sm">ID</th>
<th className="p-3 text-left text-sm">Title</th>
<th className="p-3 text-left text-sm">Status</th>
<th className="p-3 text-left text-sm">Hours</th>
<th className="p-3 text-left text-sm">Date</th>
</tr>

</thead>

<tbody>

{combinedTasks.map(task => (

<tr key={task.id} className="border-t">

<td className="p-3 text-sm">
TD{String(task.id).padStart(3,"0")}
</td>

<td className="p-3 text-sm font-medium">
{task.title}
</td>

<td className="p-3">
<span className={`px-2 py-1 text-xs rounded ${getStatusColor(task.status)}`}>
{task.status}
</span>
</td>

<td className="p-3 text-sm">
{task.allotted_hours
? `${Math.floor(task.allotted_hours/60)}h ${task.allotted_hours%60}m`
: "-"
}
</td>

<td className="p-3 text-sm">
{formatDate(task.displayDate)}
</td>

</tr>

))}

</tbody>

</table>

</div>

</div>

</EmployeeLayout>

  );

}

export default DevelopmentReport;