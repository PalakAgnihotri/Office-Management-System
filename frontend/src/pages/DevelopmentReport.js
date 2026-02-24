import { useEffect, useState } from "react";
import API from "../services/api";
import EmployeeLayout from "../layouts/EmployeeLayout";

function DevelopmentReport() {

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");


  useEffect(() => {
    fetchTasks();
  }, []);


  const fetchTasks = async () => {
    try {

      const res = await API.get("/development/all");

      setTasks(res.data);

    } catch (err) {

      console.log(err);

    }
  };


  const filtered = tasks.filter((task) =>
    task.title?.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <EmployeeLayout>

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-6">
        Development Tasks Report
      </h1>


      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search development tasks..."
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
        />


        {/* MOBILE VIEW */}

        <div className="sm:hidden space-y-4">

          {filtered.map(task => (

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
                  {task.created_at
                    ? new Date(task.created_at)
                        .toLocaleDateString("en-IN")
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
                <th className="p-4">Date</th>

              </tr>

            </thead>


            <tbody>

              {filtered.map(task => (

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
                    {task.created_at
                      ? new Date(task.created_at)
                          .toLocaleDateString("en-IN")
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