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
  const [password, setPassword] = useState("");

  useEffect(() => {
    fetchEmployees();
  }, []);

  // const fetchEmployees = async () => {
  //   const res = await API.get("/employees");
  //   setEmployees(res.data);
  // };
  const fetchEmployees = async () => {
  try {
    const res = await API.get("/employees");

    if (Array.isArray(res.data)) {
      setEmployees(res.data);
    } else if (Array.isArray(res.data.employees)) {
      setEmployees(res.data.employees);
    } else {
      console.error("Unexpected response:", res.data);
      setEmployees([]);
    }

  } catch (err) {
    console.error("EMPLOYEE FETCH ERROR:", err.response?.data || err);
    setEmployees([]);
  }
};

  const handleSave = async () => {
    if (!name || !email ||!password) return alert("Name, Email and Password required");

    await API.post("/employees", {
      name,
      email,
      password,
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
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Employee Master</h1>

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
        <label className="block mb-2">Password</label>
<input
  type="password"
  className="w-full border p-3 rounded-lg mb-4"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
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
              setPassword("");
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
      {/* EMPLOYEE LIST */}
<div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

  <input
    type="text"
    placeholder="Search employees..."
    className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  {/* ================= MOBILE VIEW (CARDS) ================= */}
  <div className="sm:hidden space-y-4">
    {filtered.map((emp) => (
      <div
        key={emp.id}
        className="border rounded-xl p-4 shadow-sm bg-gray-50"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">
            {emp.name}
          </h2>
          <span className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full">
            {emp.designation || "Employee"}
          </span>
        </div>

        <div className="text-sm space-y-1">
          <p><strong>Email:</strong> {emp.email}</p>
          <p><strong>Phone:</strong> {emp.phone || "-"}</p>
          <p><strong>Department:</strong> {emp.department || "-"}</p>
        </div>

        <button
          onClick={() => handleDelete(emp.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete Employee
        </button>
      </div>
    ))}
  </div>

  {/* ================= DESKTOP TABLE ================= */}
  <div className="hidden sm:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
          <th className="py-3 px-2">Name</th>
          <th className="px-2">Email</th>
          <th className="px-2">Phone</th>
          <th className="px-2">Department</th>
          <th className="px-2">Designation</th>
          <th className="px-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map((emp) => (
          <tr
            key={emp.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="py-3 px-2 font-medium">
              {emp.name}
            </td>
            <td className="px-2">{emp.email}</td>
            <td className="px-2">{emp.phone || "-"}</td>
            <td className="px-2">{emp.department || "-"}</td>
            <td className="px-2">{emp.designation || "-"}</td>
            <td
              onClick={() => handleDelete(emp.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
    </AdminLayout>
  );
}

export default EmployeeMaster;
