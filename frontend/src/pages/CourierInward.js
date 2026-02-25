import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function CourierInward() {
  const [form, setForm] = useState({
    courier_no: "",
    from: "",
    received_by: "",
    remarks: ""
  });

  const [inwards, setInwards] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchInwards();
  }, []);

  const fetchInwards = async () => {
    const res = await API.get("/courier/inward");
    setInwards(res.data);
  };

  const handleSave = async () => {
    const { courier_no, from, received_by } = form;

    if (!courier_no || !from || !received_by)
      return alert("Fill required fields");

    await API.post("/courier/inward", form);

    alert("Saved successfully");

    setForm({
      courier_no: "",
      from: "",
      received_by: "",
      remarks: ""
    });

    fetchInwards();
  };

  const handleDelete = async (id) => {
    await API.delete(`/courier/inward/${id}`);
    fetchInwards();
  };

  const filtered = inwards.filter((item) =>
    item.courier_no.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        Courier Inward Entry
      </h1>

      {/* FORM */}
      
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <label className="block font-medium mb-2">Courier No</label>
        <input
          type="text"
          placeholder="Courier number"
          value={form.courier_no}
          onChange={(e) =>
            setForm({ ...form, courier_no: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-4"
        />
        <label className="block font-medium mb-2">From</label>

        <input
          type="text"
          placeholder="From"
          value={form.from}
          onChange={(e) =>
            setForm({ ...form, from: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-4"
        />
<label className="block font-medium mb-2">Received By</label>
        <input
          type="text"
          placeholder="Received By"
          value={form.received_by}
          onChange={(e) =>
            setForm({ ...form, received_by: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-4"
        />
<label className="block font-medium mb-2">Remarks</label>
        <textarea
          placeholder="Remarks"
          value={form.remarks}
          onChange={(e) =>
            setForm({ ...form, remarks: e.target.value })
          }
          className="w-full border p-3 rounded-lg mb-4"
        />

        <button
          onClick={handleSave}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg"
        >
          Save Inward
        </button>
      </div>

      {/* TABLE */}
      {/* INWARD LIST */}
<div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

  <input
    type="text"
    placeholder="Search inward..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
  />

  {/* ================= MOBILE VIEW (CARDS) ================= */}
  <div className="sm:hidden space-y-4">
    {filtered.map((item) => (
      <div
        key={item.id}
        className="border rounded-xl p-4 shadow-sm bg-gray-50"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">
            #{item.courier_no}
          </h2>
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="text-sm space-y-1">
          <p><strong>From:</strong> {item.sender}</p>
          <p><strong>Received By:</strong> {item.received_by}</p>
          <p><strong>Remarks:</strong> {item.remarks || "-"}</p>
        </div>

        <button
          onClick={() => handleDelete(item.id)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Delete 
        </button>
      </div>
    ))}
  </div>

  {/* ================= DESKTOP TABLE ================= */}
  <div className="hidden sm:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
          <th className="py-3 px-2">Courier No</th>
          <th className="px-2">From</th>
          <th className="px-2">Received By</th>
          <th className="px-2">Remarks</th>
          <th className="px-2">Date</th>
          <th className="px-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map((item) => (
          <tr
            key={item.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="py-3 px-2 font-medium">
              {item.courier_no}
            </td>
            <td className="px-2">{item.sender}</td>
            <td className="px-2">{item.received_by}</td>
            <td className="px-2">{item.remarks || "-"}</td>
            <td className="px-2">
              {new Date(item.created_at).toLocaleDateString()}
            </td>
            <td className="align-middle">
            <td>

              <button
                onClick={() => handleDelete(item.id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
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
    </AdminLayout>
  );
}

export default CourierInward;
