import { useEffect, useState } from "react";
import API from "../services/api";
import EmployeeLayout from "../layouts/EmployeeLayout";

function DevelopmentReport() {
  const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [myTasks, setMyTasks] = useState([]);
  const [fromDate, setFromDate] = useState(getToday());
  const [toDate, setToDate] = useState(getToday());



  useEffect(() => {
    fetchTasks();
    fetchMyTasks();
  }, []);


 const fetchTasks = async () => {
  try {
    const res = await API.get("/employee-development/my");

    console.log("API RESPONSE:", res.data);

    if (Array.isArray(res.data)) {
      setTasks(res.data);
    } else if (Array.isArray(res.data.tasks)) {
      setTasks(res.data.tasks);
    } else {
      setTasks([]); // fallback safety
    }

  } catch (err) {
    console.log(err);
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

  const filtered = Array.isArray(tasks)
  ? tasks.filter((task) =>
      task.title?.toLowerCase().includes(search.toLowerCase())
    )
  : [];
const filteredMyTasks =
  fromDate && toDate
    ? myTasks.filter((task) => {

        if (!task.work_date) return false;

        const matchesTitle =
          task.title?.toLowerCase().includes(search.toLowerCase());

        const taskDate =
          new Date(task.work_date).toISOString().split("T")[0];

        return (
          matchesTitle &&
          taskDate >= fromDate &&
          taskDate <= toDate
        );
      })
    : [];
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

  return (
    <EmployeeLayout>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Development Tasks Report
      </h1>


      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

        {/* SEARCH */}
<div className="bg-gradient-to-r from-purple-50 to-white border rounded-2xl p-4 sm:p-6 shadow mb-6">

  <div className="flex flex-col sm:flex-row sm:items-end gap-4">

    {/* From */}
    <div className="flex flex-col w-full sm:w-[160px]">
      <label className="text-sm font-medium text-gray-600 mb-1">
        From
      </label>
      <input
        type="date"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
        className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition w-full text-sm"
      />
    </div>

    {/* To */}
    <div className="flex flex-col w-full sm:w-[160px]">
      <label className="text-sm font-medium text-gray-600 mb-1">
        To
      </label>
      <input
        type="date"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
        className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition w-full text-sm"
      />
    </div>

    {/* Search */}
    {/* Search + Clear */}
<div className="flex flex-col flex-1">
  <label className="text-sm font-medium text-gray-600 mb-1">
    Search Task
  </label>

  <div className="flex gap-2">
    <input
      type="text"
      placeholder="Search development tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition w-full text-sm"
    />

    <button
      onClick={() => {
        setSearch("");
        const today = getToday();
setFromDate(today);
setToDate(today);
      }}
      className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300 transition whitespace-nowrap"
    >
      Refresh
    </button>
  </div>
</div>

  </div>

</div>


        {/* MOBILE VIEW */}

        <div className="sm:hidden space-y-4">

          {combinedTasks.map(task => (

            <div
              key={task.id}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >

              <div className="flex justify-between">

                <h2 className="font-semibold text-lg">
                  {task.title}
                </h2>

                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                  {task.priority}
                </span>

              </div>


              <div className="text-sm mt-2 space-y-1">

                {/* <p>
                  <strong>Employee:</strong>{" "}
                  {task.employee_name || "Unassigned"}
                </p> */}

                <p>
                  <strong>Status:</strong>{" "}
                  {task.status}
                </p>

                <p>
                  <strong>Hours:</strong>{" "}
                  {task.allotted_hours
                    ? `${Math.floor(task.allotted_hours/60)}h ${task.allotted_hours%60}m`
                    : "-"
                  }
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {task.displayDate
  ? new Date(task.displayDate)
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-")
  : "-"
}
                </p>

              </div>

            </div>

          ))}

        </div>


        {/* DESKTOP TABLE */}

        <div className="hidden sm:block overflow-x-auto">

          <table className="w-full text-left">

            <thead>

              <tr className="border-b bg-gray-50 text-sm uppercase">

                <th className="p-4">ID</th>
                <th className="p-4">Title</th>
                {/* <th className="p-4">Employee</th>
                <th className="p-4">Priority</th> */}
                <th className="p-4">Status</th>
                <th className="p-4">Hours</th>
                <th className="p-5">Date</th>

              </tr>

            </thead>


            <tbody>

              {combinedTasks.map(task => (

                <tr
                  key={task.id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    TD{String(task.id).padStart(3,"0")}
                  </td>

                  <td className="p-4 font-medium">
                    {task.title}
                  </td>

                  {/* <td className="p-4">
                    {task.employee_name || "-"}
                  </td> */}

                  {/* <td className="p-4">
                    {task.priority}
                  </td> */}

                  <td className="p-4">
                    {task.status}
                  </td>

                  <td className="p-4">
                    {task.allotted_hours
                      ? `${Math.floor(task.allotted_hours/60)}h ${task.allotted_hours%60}m`
                      : "-"
                    }
                  </td>

                  <td className="p-4">
  {task.displayDate
    ? new Date(task.displayDate)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-")
    : "-"
  }
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