import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function TaskDevelopment() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await API.get("/tasks/all");
    setTasks(res.data);
  };
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm("Are you sure you want to delete this task?");
  if (!confirmDelete) return;

  try {
    await API.delete(`/tasks/${id}`);
    fetchTasks();
  } catch (error) {
    console.error(error);
    alert("Failed to delete task");
  }
};

  const handleAddTask = async () => {
    if (!newTask.trim()) return alert("Enter task name");

    await API.post("/tasks/create", {
      title: newTask,
      description: "",
      priority: "Medium",
      due_date: null,
      assigned_to: null
    });

    setNewTask("");
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditingId(task.id);
    setEditValue(task.title);
  };

  const handleSaveEdit = async (id) => {
    await API.put(`/tasks/edit/${id}`, {
      title: editValue
    });

    setEditingId(null);
    fetchTasks();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Task Development</h1>

      {/* Add Task Block */}
      <div className="bg-white p-6 rounded-xl shadow mb-8 flex gap-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter new task name"
          className="border p-3 rounded-lg flex-1"
        />
        <button
          onClick={handleAddTask}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Task Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-b">
                <td className="py-3">
                  {editingId === task.id ? (
                    <input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border p-2 rounded"
                    />
                  ) : (
                    task.title
                  )}
                </td>

                <td>{task.status}</td>

                <td>
                  {editingId === task.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(task.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(task)}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                  )}
                  <button onClick={()=> handleDelete(task.id)
                  }
                  className="bg-red-700 text-white px-3 py-1 rounded"> Delete
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

export default TaskDevelopment;
