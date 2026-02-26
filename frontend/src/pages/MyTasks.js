import { useEffect, useState } from "react";
import EmployeeLayout from "../layouts/EmployeeLayout";
import API from "../services/api";
function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [editData, setEditData] = useState({
    status: "",
    hours: "",
    minutes:"",
    remarks:"",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
  try {
    const res = await API.get("/tasks/my-tasks");
    setTasks(res.data);
  } catch (err) {
    console.error("FETCH TASK ERROR:", err);
  }
};
const formatTime = (minutes) => {
  if (!minutes && minutes !== 0) return "N/A";

  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${hrs}h ${mins}m`;
};
// const handleMarkComplete = async (taskId) => {
//   try {
//     await API.put(`/tasks/employee/${taskId}`,
//   { status: "Completed" },
//   {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("token")}`
//     }
//   }
// );

//     alert("Task marked as completed");
//     fetchTasks(); // refresh list
//   } catch (error) {
//     console.error(error);
//     alert("Failed to update task");
//   }
// };
  const handleUpdate = async (id) => {
  try {

    const totalMinutes =
      (parseInt(editData.hours || 0) * 60) +
      parseInt(editData.minutes || 0);

    await API.put(
      `/tasks/employee/${id}`,
      {
        status: editData.status,
        allotted_hours: totalMinutes,
        remarks: editData.remarks
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

      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

  {/* ================= MOBILE VIEW (CARDS) ================= */}
  <div className="sm:hidden space-y-4">
  {tasks.map((task) => {

    const isEditing = editingId === task.id;

    return (
      <div
        key={task.id}
        className="border rounded-xl p-4 shadow-sm bg-gray-50"
      >

        {/* TITLE (READ ONLY) */}
        <h2 className="font-semibold text-lg">
          {task.title}
        </h2>

        {/* DEADLINE (READ ONLY) */}
        <p className="text-sm">
          <strong>Deadline:</strong>{" "}
          {task.due_date
            ? new Date(task.due_date).toLocaleDateString()
            : "N/A"}
        </p>


        {/* STATUS */}
        <div className="mt-2">

          <strong>Status:</strong>{" "}

          {isEditing ? (
            <select
              value={editData.status}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  status: e.target.value
                })
              }
              className="border p-2 rounded mt-1 w-full"
            >
              <option>Pending</option>
              <option>In-progress</option>
              <option>Completed</option>
              <option>On-Hold</option>
              <option>Cancelled</option>
            </select>
          ) : (
            task.status
          )}

        </div>


        {/* TIME */}
        <div className="mt-2">

          <strong>Alloted Time:</strong>{" "}

          {isEditing ? (
            <div className="flex gap-2 mt-1">

              <input
                type="number"
                placeholder="Hours"
                value={editData.hours}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    hours: e.target.value
                  })
                }
                className="border p-2 rounded w-full"
              />

              <input
                type="number"
                placeholder="Minutes"
                value={editData.minutes}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    minutes: e.target.value
                  })
                }
                className="border p-2 rounded w-full"
              />

            </div>
          ) : (
            formatTime(task.allotted_hours)
          )}
          {/* REMARKS */}
<div className="mt-2">

<strong>Remarks:</strong>

{isEditing ? (

<textarea
  placeholder="Enter remarks (optional)"
  value={editData.remarks || ""}
  onChange={(e)=>
    setEditData({
      ...editData,
      remarks:e.target.value
    })
  }
  className="border p-2 rounded w-full mt-1"
/>

) : (

task.remarks || "—"

)}

</div>

          

        </div>
        


        {/* BUTTONS */}
        <div className="flex gap-2 mt-4">

          {isEditing ? (
            <>
              <button
                onClick={() => handleUpdate(task.id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditingId(null)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => {

                const total = task.allotted_hours || 0;

                setEditingId(task.id);

                setEditData({
                  status: task.status,
                  hours: Math.floor(total / 60),
                  minutes: total % 60,
                  remarks: task.remarks || ""
                });

              }}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          )}

        </div>

      </div>
    );

  })}
</div>

  {/* ================= DESKTOP TABLE ================= */}
  <div className="hidden sm:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
          <th className="p-4">Task</th>
          <th className="p-4">Deadline</th>
          <th className="p-4">Alloted Time</th>
          <th className="p-4">Status</th>
          <th className="p-4">Remarks</th>
          <th className="p-4 text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {tasks.map((task) => (
          <tr
            key={task.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="p-4 font-medium">{task.title}</td>

            <td className="p-4">
              {task.due_date
                ? new Date(task.due_date).toLocaleDateString()
                : "N/A"}
            </td>

            <td className="p-4">
              {editingId === task.id ? (
                <div className="flex gap-2">
  <input
    type="number"
    placeholder="H"
    className="border p-1 rounded w-16"
    value={editData.hours}
    onChange={(e) =>
      setEditData({
        ...editData,
        hours: e.target.value
      })
    }
  />

  <input
    type="number"
    placeholder="M"
    className="border p-1 rounded w-16"
    value={editData.minutes}
    onChange={(e) =>
      setEditData({
        ...editData,
        minutes: e.target.value
      })
    }
  />
</div>
              ) : (
                formatTime(task.allotted_hours)
              )}
            </td>

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
                  <option>On-Hold</option>
                  <option>Cancelled</option>
                </select>
              ) : (
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-600"
                      : task.status === "In-progress"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {task.status}
                </span>
              )}
            </td>
            <td className="p-4">

{editingId === task.id ? (

<textarea
  value={editData.remarks || ""}
  onChange={(e)=>
    setEditData({
      ...editData,
      remarks:e.target.value
    })
  }
  className="border p-1 rounded w-full"
/>

) : (

task.remarks || "—"

)}

</td>

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
                <>
                  {/* {task.status !== "Completed" && (
                    <button
                      onClick={() => handleMarkComplete(task.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Complete
                    </button>
                  )} */}
                  <td className="align-middle">

                  <button
                    onClick={() => {
                      setEditingId(task.id);
                      setEditData({
                        status: task.status,
                        allotted_hours:
                        task.allotted_hours || "",
                        remarks: task.remarks || ""
                      });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  </td>
                </>
              )}
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

export default MyTasks;