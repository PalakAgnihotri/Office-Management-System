import { useEffect, useState } from "react";
import API from "../services/api";
import EmployeeLayout from "../layouts/EmployeeLayout";

function EmployeeTaskDevelopment(){

const getToday = ()=> new Date().toISOString().split("T")[0];

const [tasks,setTasks]=useState([]);
const [editingId,setEditingId]=useState(null);
const [search,setSearch]=useState("");

const [form,setForm]=useState({

title:"",
description:"",
status:"",
dueDate:getToday(),
hours:"",
minutes:""

});
useEffect(()=>{

fetchTasks();

},[]);
const fetchTasks = async () => {
  try {
    const res = await API.get("/employee-development/my");

    // console.log(res.data); 

    if (Array.isArray(res.data)) {
      setTasks(res.data);
    } else if (Array.isArray(res.data.tasks)) {
      setTasks(res.data.tasks);
    } else {
      setTasks([]);
    }

  } catch (err) {
    // console.log(err);
    setTasks([]);
  }
};
const handleSave=async()=>{

if(!form.title){

alert("Title required");

return;

}


const totalMinutes=
(parseInt(form.hours||0)*60)+
parseInt(form.minutes||0);


const payload={

title:form.title,
description:form.description,
status:form.status,
due_date:form.dueDate,
allotted_hours:totalMinutes

};


if(editingId){

await API.put(`/employee-development/${editingId}`, payload)
alert("Task Edited Successfully");
}
else{

await API.post("/employee-development/create",payload);
alert("Task Saved Successfully");
}

setForm({

title:"",
description:"",
status:"",
dueDate:getToday(),
hours:"",
minutes:""

});


setEditingId(null);

fetchTasks();

};
// const handleEdit=(task)=>{

// const total=task.allotted_hours||0;

// setEditingId(task.editingId);

// setForm({

// title:task.title,
// description:task.description,
// status:task.status,
// dueDate:task.due_date?.split("T")[0],
// hours:Math.floor(total/60),
// minutes:total%60

// });

// };
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

const handleDelete=async(editingId)=>{

await API.delete(`/employee-development/${editingId}`);
alert("Task Deleted Successfully");
fetchTasks();

};
const filteredTasks = tasks.filter((task) =>
    task.title?.toLowerCase().includes(search.toLowerCase())
  );
return(

<EmployeeLayout>

<h1 className="text-2xl font-bold mb-6">
My Development Tasks
</h1>


{/* FORM */}

<div className="bg-white p-6 rounded-xl shadow mb-6">

<input
placeholder="Title"
value={form.title}
onChange={(e)=>setForm({...form,title:e.target.value})}
className="border p-3 rounded w-full mb-3"
/>
<textarea
placeholder="Description"
value={form.description}
onChange={(e)=>setForm({...form,description:e.target.value})}
className="border p-3 rounded w-full mb-3"
/>
<select
value={form.status}
onChange={(e)=>setForm({...form,status:e.target.value})}
className="border p-3 rounded w-full mb-3"
>
<option value="">Select Status</option>
<option>Pending</option>
<option>In-progress</option>
<option>Completed</option>
</select>
<input
type="date"
value={form.dueDate}
onChange={(e)=>setForm({...form,dueDate:e.target.value})}
className="border p-3 rounded w-full mb-3"
/>
<div className="flex gap-2">

<input
type="number"
placeholder="Hours"
value={form.hours}
onChange={(e)=>setForm({...form,hours:e.target.value})}
className="border p-3 rounded w-full"
/>

<input
type="number"
placeholder="Minutes"
value={form.minutes}
onChange={(e)=>setForm({...form,minutes:e.target.value})}
className="border p-3 rounded w-full"
/>

</div>


<button
onClick={handleSave}
className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
>
{editingId?"Update":"Create"}
</button>

</div>



{/* LIST */}

<div className="bg-white p-6 rounded-xl shadow">

<input
placeholder="Search"
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="border p-3 rounded w-full mb-4"
/>


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
  <strong>Date:</strong>{" "}
  {task.due_date
    ? new Date(task.due_date)
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-")
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


</EmployeeLayout>

);

}

export default EmployeeTaskDevelopment;
