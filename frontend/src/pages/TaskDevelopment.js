import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function TaskDevelopment() {
  const [tasks, setTasks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [notes, setNotes] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const fetchMyTasks = async () => {
    try {
      const res = await API.get("/tasks/all");
      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUpdates = async (taskId) => {
    try {
      const res = await API.get(`/tasks/updates/${taskId}`);
      setUpdates(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
  if (!taskName.trim() || !notes.trim()) {
    alert("Fill all fields");
    return;
  }

  // Find task by name from employee's assigned tasks
  const matchedTask = tasks.find(
    (task) =>
      task.title.toLowerCase().trim() ===
      taskName.toLowerCase().trim()
  );

  if (!matchedTask) {
    alert("Task not found");
    return;
  }

  try {
    await API.post(`/tasks/update-with-comment/${matchedTask.id}`, {
      status: "In-progress",
      comment: notes
    });

    alert("Development Saved");
    setNotes("");
    fetchUpdates(matchedTask.id);
  } catch (err) {
    console.log(err);
  }
};


  const filteredUpdates = updates.filter((u) =>
    u.comment?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Task Development</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">


        {/* Name Task */}
        <label className="block font-medium mb-2">Name Task</label>
            <input
                 type="text"
  value={taskName}
  onChange={(e) => setTaskName(e.target.value)}
  placeholder="Enter task name"
  className="w-full border p-3 rounded-lg mb-6"
            />


        <label className="block font-medium mb-2">
          Notes / Progress
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe progress"
          className="w-full border p-4 rounded-lg mb-6 h-28"
        />

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Save Development
          </button>

          <button
            onClick={() => setNotes("")}
            className="border px-6 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search development..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-1/2"
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
              <th className="py-3">Name Task</th>
              <th>Notes</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUpdates.map((update) => (
              <tr key={update.id} className="border-b">
                <td className="py-3">{update.task_title}</td>
                <td>{update.comment}</td>
                <td>
                  {new Date(update.created_at).toLocaleDateString()}
                </td>
                <td className="text-red-500 cursor-pointer">
                  Delete
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default TaskDevelopment;
