import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function TaskEntry() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    client: "",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    dueTime: "",
    allottedHours: ""
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/all");
      setTasks(res.data.tasks || res.data);

    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
  try {

    const dueDateTime =
      form.dueDate && form.dueTime
        ? `${form.dueDate}T${form.dueTime}`
        : null;

    const payload = {
  title: form.title,
  client: form.client, 
  priority: form.priority,
  due_date: `${form.dueDate} ${form.dueTime}:00`,
  assigned_to: form.assigned_to || null,
  allotted_hours: form.allottedHours || null,
};
    if(editingId){
      await API.put(`/tasks/${editingId}`,payload);
    }else{

    await API.post("/tasks/create", payload);
    }
    fetchTasks();

    setForm({
      title: "",
      client: "",
      priority: "Medium",
      status: "Pending",
      dueDate: "",
      dueTime: "",
      allotedHours: ""
    });

  } catch (err) {
    console.log(err.response?.data || err.message);
    alert("Failed to save task");
  }
};

  const handleDelete = async (id) => {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  };
  const handleEdit = (task) => {
  setForm({
    title: task.title,
    client: task.description,
    priority: task.priority,
    status: task.status,
    dueDate: task.due_date?.split("T")[0] || "",
    dueTime: "",
    allottedHours: task.allotted_hours || ""
  });

  setEditingId(task.id);
};

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Task Entry</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-10">

        <div className="grid grid-cols-1 gap-5">

          <input
            type="text"
            placeholder="Enter task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <input
            type="text"
            placeholder="Client name"
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            className="border p-3 rounded-lg"
          />

          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
            className="border p-3 rounded-lg"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border p-3 rounded-lg"
          >
            <option>Pending</option>
            <option>In-progress</option>
            <option>Completed</option>
          </select>

          <div className="flex gap-4">
            <input
              type="date"
              value={form.due_Date}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="border p-3 rounded-lg w-full"
            />

            <input
              type="time"
              value={form.dueTime}
              onChange={(e) => setForm({ ...form, dueTime: e.target.value })}
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

          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-cyan-600 text-white px-6 py-2 rounded-lg"
            >
              Save Task
            </button>

            <button
              onClick={() =>
                setForm({
                  title: "",
                  client: "",
                  priority: "Medium",
                  status: "Pending",
                  dueDate: "",
                  dueTime: ""
                })
              }
              className="border px-6 py-2 rounded-lg"
            >
              Clear
            </button>
          </div>

        </div>
      </div>

      {/* SEARCH + TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            className="border p-3 rounded-lg w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-3">
            <button className="border px-4 py-2 rounded-lg">
              Export CSV
            </button>
            <button className="border px-4 py-2 rounded-lg">
              Export PDF
            </button>
          </div>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Title</th>
              <th>Client</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Allotted Hours</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="py-3">{task.title}</td>
                <td>{task.client}</td>
                <td>{task.priority}</td>
                <td>{task.status}</td>
                <td>{task.due_Date || "N/A"}</td>
                <td>{task.allotted_hours}</td>
                <td className="py-3 flex gap-3">
                  <button
  onClick={() => {
    setForm({
      title: task.title,
      client: task.client,
      priority: task.priority,
      status: task.status,
      dueDate: task.due_date?.split("T")[0] || "",
      dueTime: task.due_date?.split("T")[1]?.substring(0,5) || "",
      allotted_hours: task.allotted_hours || ""
    });

    setEditingId(task.id);  
  }}
  className="bg-blue-500 text-white px-3 py-1 rounded"
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
