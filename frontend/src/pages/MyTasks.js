import { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLayout from "../layouts/EmployeeLayout";

function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    status: "",
    allotted_hours: ""
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(
      "http://localhost:5000/api/tasks/my-tasks",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    setTasks(res.data);
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/employee/${id}`,
        {
          status: editData.status,
          allotted_hours:
            editData.allotted_hours !== ""
              ? editData.allotted_hours
              : null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      setEditingId(null);
      fetchTasks();

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <EmployeeLayout>
      <h1 className="text-3xl font-bold mb-8">My Tasks</h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full table-fixed text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 w-1/5">Task</th>
              <th className="p-4 w-1/5">Deadline</th>
              <th className="p-4 w-1/5">Allotted Hours</th>
              <th className="p-4 w-1/5">Status</th>
              <th className="p-4 w-1/5 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t">

                <td className="p-4">{task.title}</td>

                <td className="p-4">
                  {task.due_date
                    ? new Date(task.due_date).toLocaleDateString()
                    : "N/A"}
                </td>

                {/* Allotted Hours */}
                <td className="p-4">
                  {editingId === task.id ? (
                    <input
                      type="number"
                      className="border p-1 rounded w-20"
                      value={editData.allotted_hours}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          allotted_hours: e.target.value
                        })
                      }
                    />
                  ) : (
                    task.allotted_hours || "N/A"
                  )}
                </td>

                {/* Status */}
                <td className="p-4">
                  {editingId === task.id ? (
                    <select
                      className="border p-1 rounded"
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          status: e.target.value
                        })
                      }
                    >
                      <option>Pending</option>
                      <option>In-progress</option>
                      <option>Completed</option>
                    </select>
                  ) : (
                    task.status
                  )}
                </td>

                {/* Action */}
                <td className="p-4 text-center space-x-2">
                  {editingId === task.id ? (
                    <>
                      <button
                        onClick={() => handleUpdate(task.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded"
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
                      onClick={() => {
                        setEditingId(task.id);
                        setEditData({
                          status: task.status,
                          allotted_hours:
                            task.allotted_hours || ""
                        });
                      }}
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </EmployeeLayout>
  );
}

export default MyTasks;