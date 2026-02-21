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
      <h1 className="text-2xl font-bold mb-6">
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
      <div className="bg-white p-6 rounded-xl shadow">
        <input
          type="text"
          placeholder="Search inward..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg mb-6 w-1/2"
        />

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>No</th>
              <th>From</th>
              <th>Received By</th>
              <th>Remarks</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b">
                <td>{item.courier_no}</td>
                <td>{item.sender}</td>
                <td>{item.received_by}</td>
                <td>{item.remarks}</td>
                <td>
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-500"
                  >
                    Delete
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

export default CourierInward;
