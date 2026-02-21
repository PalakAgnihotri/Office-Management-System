import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function EmployeeMaster() {
  const [employees, setEmployees] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await API.get("/employees");
    setEmployees(res.data);
  };

  const handleSave = async () => {
    if (!name || !email) return alert("Name and Email required");

    await API.post("/employees", {
      name,
      email,
      phone,
      department,
      designation,
      joining_date: joiningDate
    });

    alert("Employee added");
    setName("");
    setEmail("");
    setPhone("");
    setDepartment("");
    setDesignation("");
    setJoiningDate("");
    fetchEmployees();
  };

  const handleDelete = async (id) => {
    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  const filtered = employees.filter((emp) =>
    emp.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Employee Master</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <label className="block mb-2">Name</label>
        <input
          className="w-full border p-3 rounded-lg mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="block mb-2">Email</label>
        <input
          className="w-full border p-3 rounded-lg mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2">Phone</label>
        <input
          className="w-full border p-3 rounded-lg mb-4"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <label className="block mb-2">Department</label>
        <input
          className="w-full border p-3 rounded-lg mb-4"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        />

        <label className="block mb-2">Designation</label>
        <input
          className="w-full border p-3 rounded-lg mb-4"
          value={designation}
          onChange={(e) => setDesignation(e.target.value)}
        />

        <label className="block mb-2">Joining Date</label>
        <input
          type="date"
          className="w-full border p-3 rounded-lg mb-6"
          value={joiningDate}
          onChange={(e) => setJoiningDate(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg"
          >
            Save Employee
          </button>

          <button
            onClick={() => {
              setName("");
              setEmail("");
              setPhone("");
              setDepartment("");
              setDesignation("");
              setJoiningDate("");
            }}
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
            placeholder="Search employees..."
            className="border p-3 rounded-lg w-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp) => (
              <tr key={emp.id} className="border-b">
                <td className="py-3">{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.department}</td>
                <td>{emp.designation}</td>
                <td
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(emp.id)}
                >
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

export default EmployeeMaster;