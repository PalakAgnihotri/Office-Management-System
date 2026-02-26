import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function TaskDevelopment() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "",
    // employee_id: "",
    // priority: "Medium",
    
    dueDate: getToday(),
    hours: "",
    minutes: ""
  });

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/development/all");
    setTasks(res.data);
  };

  const fetchEmployees = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  const handleSave = async () => {
    if(!form.title.trim()){
      alert("Task Title Required");
      return;
    }
    if(!form.status){
      alert("Status Required");
      return;
    }
    try {
      const totalMinutes =
      (parseInt(form.hours || 0) * 60) +
      parseInt(form.minutes || 0);
      const payload = {
        title: form.title,
        description: form.description,
        // priority: form.priority,
        status: form.status,
        due_date: form.dueDate ? form.dueDate:null || null,
        allotted_hours: totalMinutes || null,
        minutes : form.minutes || null ,
        // employee_id: form.employee_id || null
      };

      if (editingId) {
        await API.put(`/development/${editingId}`, payload);
        alert("Task Updated Successfully");
      } else {
        await API.post("/development/create", payload);
        alert("Task Saved Successfully");
      }

      fetchTasks();
      setEditingId(null);

      setForm({
        title: "",
        description: "",
        // employee_id: "",
        // priority: "Medium",
        status: "",
        dueDate: getToday(),
        hours: "",
        minutes: ""
      });

    } catch (err) {
      console.log(err);
      alert("Failed to save task");
    }
  };

  const handleEdit = (task) => {

  setEditingId(task.id);

  const total = task.allotted_hours || 0;
  const hrs = Math.floor(total / 60);
  const mins = total % 60;

  let formattedDate = getToday();

  if (task.due_date) {
    const d = new Date(task.due_date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    formattedDate = d.toISOString().split("T")[0];
  }

  setForm({
    title: task.title || "",
    description: task.description || "",
    status: task.status || "",
    dueDate: formattedDate,
    hours: hrs,
    minutes: mins
  });

};

  const handleDelete = async (id) => {
    try {
      await API.delete(`/development/${id}`);
      alert("Task Deleted");
      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };
  

  const filteredTasks = tasks.filter((task) =>
    task.title?.toLowerCase().includes(search.toLowerCase())
  );
  
  

  return (
    <AdminLayout>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Task Development</h1>

      {/* Form */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6">
        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Enter Task Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="border p-3 rounded-lg"
          />

          <textarea
            placeholder="Enter Task Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="border p-3 rounded-lg"
          />

          {/* <select
            value={form.employee_id}
            onChange={(e) =>
              setForm({ ...form, employee_id: e.target.value })
            }
            className="border p-3 rounded-lg"
          >
            <option value="">Select Employee</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select> */}

          {/* <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
            className="border p-3 rounded-lg"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select> */}

          <select
          
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="border p-3 rounded-lg"
          ><option value="" disabled hidden >
    Select Status
  </option>
            <option>Pending</option>
            <option>In-progress</option>
            <option>Completed</option>
          </select>
          <div className="flex flex-col sm:flex-row gap-4 w-full">

          <input
            type="date"
            value={form.dueDate}
            onChange={(e) =>
              setForm({ ...form, dueDate: e.target.value })
            }
            className="border p-3 rounded-lg w-full"
          />

          <input
    type="number"
    placeholder="Allotted Hours"
    value={form.hours}
    onChange={(e) =>
      setForm({ ...form,  hours: e.target.value })
    }
    className="border p-3 rounded-lg w-full"
  />
  <input
    type="number"
    placeholder="Allotted Minutes"
    value={form.minutes}
    onChange={(e) =>
      setForm({ ...form, minutes: e.target.value })
    }
    className="border p-3 rounded-lg w-full"
  />
  </div>


          <button
            onClick={handleSave}
            className="bg-cyan-600 text-white px-6 py-2 rounded-lg"
          >
            {editingId ? "Update Task" : "Save Task"}
          </button>

        </div>
      </div>

      {/* Task List */}
<div className="bg-white p-4 sm:p-6 rounded-2xl shadow">
  <input
    type="text"
    placeholder="Search tasks..."
    className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* ================= MOBILE VIEW (CARDS) ================= */}
  <div className="sm:hidden space-y-4">
    {filteredTasks.map((task) => (
      <div
        key={task.id}
        className="border rounded-xl p-4 shadow-sm bg-gray-50"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">
            {task.title}
          </h2>

          {/* <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
            {task.priority}
          </span>*/}
        </div> 
        <p className="text-sm text-gray-600 mb-2">
          {task.description}
        </p>

        <div className="text-sm space-y-1">
          <p><strong>ID:</strong> TD{String(task.id).padStart(3, "0")}</p>
          {/* <p><strong>Employee:</strong> {task.employee_name || "Unassigned"}</p> */}
          <p><strong>Status:</strong> {task.status}</p>
          <p>
            <strong>Date:</strong>
              {task.due_date
  ? new Date(task.due_date).toLocaleDateString("en-IN")
  : "-"}
            </p>
          <p>
            <strong>Hours:</strong> {task.allotted_hours
              ? `${Math.floor(task.allotted_hours / 60)}h ${
                  task.allotted_hours % 60
                }m`
              : "-"}
          </p>
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={() => handleEdit(task)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(task.id)}
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    ))}
  </div>

  {/* ================= DESKTOP TABLE ================= */}
  <div className="hidden sm:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
          <th className="py-3 px-2">ID</th>
          <th className="px-2">Title</th>
          <th className="px-2">Description</th>
          {/* <th className="px-2">Employee</th>
          <th className="px-2">Priority</th> */}
          <th className="px-2">Status</th>
          <th className="px-2">Date</th>
          <th className="px-2">Hours</th>
          <th className="px-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredTasks.map((task) => (
          <tr
            key={task.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="py-3 px-2">
              TD{String(task.id).padStart(3, "0")}
            </td>
            <td className="px-2 font-medium">
              {task.title}
            </td>
            <td className="px-2 font-medium">{task.description || "-"}</td>
            {/* <td className="px-2">
              {task.employee_name || "-"}
            </td>
            <td className="px-2">{task.priority}</td> */}
            <td className="px-2">{task.status}</td>
            <td className="px-2">
              {task.due_date
  ? new Date(task.due_date).toLocaleDateString("en-IN")
  : "-"}
            </td>
            <td className="px-2">
              {task.allotted_hours
                ? `${Math.floor(task.allotted_hours / 60)}h ${
                    task.allotted_hours % 60
                  }m`
                : "-"}
            </td>
            <td className="align-middle">
            <td className="px-2 flex gap-3">
              <button
                onClick={() => handleEdit(task)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(task.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </td>
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

export default TaskDevelopment;
