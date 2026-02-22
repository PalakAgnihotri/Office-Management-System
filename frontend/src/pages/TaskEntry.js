import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function TaskEntry() {
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [taskList, setTaskList] = useState([]);
  const [search, setSearch] = useState("");
  const[employees, setEmployees]=useState([])
  const [editingId, setEditingId] = useState(null);
  

  const [form, setForm] = useState({
    task_id: "",
    employee_id: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    dueTime: "",
    allottedHours: ""
  });

  useEffect(() => {
    fetchAssignedTasks();
    fetchTaskList();
    fetchEmployees();
  }, []);

  const fetchAssignedTasks = async () => {
  const res = await API.get("/tasks/entry", {
    headers: {
      "Cache-Control": "no-cache"
    }
  });
  setAssignedTasks(res.data);
};

  const fetchTaskList = async () => {
    const res = await API.get("/tasks/all");
    setTaskList(res.data);
  };

  const fetchEmployees = async () => {
  const res = await API.get("/users/employees");
  setEmployees(res.data);
};

  const handleSave = async () => {
  try {
    await API.put(`/tasks/${editingId || form.task_id}`, {
      priority: form.priority,
      status: form.status,
      due_date: `${form.dueDate} ${form.dueTime}:00`,
      allotted_hours: form.allottedHours || null,
      employee_id: form.employee_id
    });

    fetchAssignedTasks();

    setEditingId(null);

    setForm({
      task_id: "",
      employee_id: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
      dueTime: "",
      allottedHours: ""
    });

  } catch (err) {
    console.log(err);
    alert("Failed to save task");
  }
};
const handleEdit = (task) => {
  setEditingId(task.id);

  setForm({
    task_id: task.id,
    employee_id: task.assigned_to || "",
    priority: task.priority || "Medium",
    status: task.status || "Pending",
    dueDate: task.due_date
      ? task.due_date.split("T")[0]
      : "",
    dueTime: task.due_date
      ? task.due_date.split("T")[1]?.slice(0, 5)
      : "",
    allottedHours: task.allotted_hours || ""
  });
};

  const handleDelete = async (id) => {
  try {
    await API.delete(`/tasks/${id}`);
    fetchAssignedTasks();
  } catch (err) {
    console.log("Delete error:", err);
  }
};

  const filteredTasks = Array.isArray(assignedTasks)
  ? assignedTasks.filter((task) =>
      task.title?.toLowerCase().includes(search.toLowerCase())
    )
  : [];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Task Entry</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-10">
        <div className="grid grid-cols-1 gap-5">

          {/* Task Dropdown */}
          <select
            value={form.task_id}
            onChange={(e) =>
              setForm({ ...form, task_id: e.target.value })
            }
            className="border p-3 rounded-lg"
          >
            <option value="">Select Task</option>
            {taskList.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>

          <select
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
</select>

          <select
            value={form.priority}
            onChange={(e) =>
              setForm({ ...form, priority: e.target.value })
            }
            className="border p-3 rounded-lg"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value })
            }
            className="border p-3 rounded-lg"
          >
            <option>Pending</option>
            <option>In-progress</option>
            <option>Completed</option>
          </select>

          <div className="flex gap-4">
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) =>
                setForm({ ...form, dueDate: e.target.value })
              }
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="time"
              value={form.dueTime}
              onChange={(e) =>
                setForm({ ...form, dueTime: e.target.value })
              }
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="number"
              placeholder="Allotted Hours"
              value={form.allottedHours}
              onChange={(e) =>
                setForm({ ...form, allottedHours: e.target.value })
              }
              className="border p-3 rounded-lg"
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

      {/* Assigned Tasks Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          placeholder="Search tasks..."
          className="border p-3 rounded-lg w-1/2 mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Task</th>
              <th>Client</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Due Time</th>
              <th>Hours</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td>{task.title}</td>
                <td>{task.employee_name}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>
    {task.due_date
      ? new Date(task.due_date).toLocaleDateString()
      : ""}
  </td>

  <td>
    {task.due_date
      ? new Date(task.due_date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })
      : ""}
  </td>
                <td>{task.allotted_hours}</td>
                <td className="flex gap-3">
  <button
    onClick={() => handleEdit(task)}
    className="text-blue-500"
  >
    Edit
  </button>

  <button
    onClick={() => handleDelete(task.id)}
    className="text-red-500"
  >
    Delete
  </button>
</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </AdminLayout>
  );
}

export default TaskEntry;