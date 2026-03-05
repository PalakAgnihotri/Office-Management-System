import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function TaskAllotment() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/pending");
      const pendingTasks = res.data.filter(
        (task) => task.status !== "Completed"
      );
      setTasks(pendingTasks);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleAssign = async (taskId) => {
  if (!selectedEmployee) return alert("Select employee first");

  try {

    await API.put(`/tasks/assign/${taskId}`, {
      employeeId: selectedEmployee,
      allotted_hours: null
    });

    alert("Task Assigned Successfully");

    setSelectedTaskId(null);
    setSelectedEmployee("");

    fetchTasks();

  } catch (err) {

    console.log(err);
    alert("Failed to assign task");

  }
};

  return (
    <AdminLayout>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Task Allotment</h1>

      <div className="space-y-4">
        {tasks.length === 0 && (
          <p className="text-gray-500">No unassigned tasks available.</p>
        )}

        {tasks.map((task) => (
          <div key={task.id} className="bg-white p-5 rounded-xl shadow">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">{task.title}</h2>
                <p className="text-sm text-gray-600">
                  Priority: {task.priority} | Status: {task.status}
                </p>
              </div>

              {selectedTaskId !== task.id ? (
                <button
                  onClick={() => setSelectedTaskId(task.id)}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg"
                >
                  Assign
                </button>
              ) : (
                <div className="flex gap-3 items-center">
                  <select
                    value={selectedEmployee}
                    onChange={(e) =>
                      setSelectedEmployee(e.target.value)
                    }
                    className="border p-2 rounded-lg"
                  >
                    <option value="">Select Employee</option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleAssign(task.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Confirm
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

export default TaskAllotment;
