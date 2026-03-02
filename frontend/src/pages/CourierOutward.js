import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function CourierOutward() {
  const [courierNo, setCourierNo] = useState("");
  const [to, setTo] = useState("");
  const [sentBy, setSentBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [outwards, setOutwards] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchOutwards();
  }, []);

  const fetchOutwards = async () => {
    try {
      const res = await API.get("/courier/outward");
      setOutwards(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    if (!courierNo || !to || !sentBy) {
      alert("Fill all required fields");
      return;
    }

    try {
      await API.post("/courier/outward", {
        courier_no: courierNo,
        to: to,
        sent_by: sentBy,
        remarks: remarks
      });

      alert("Outward saved successfully");
      setCourierNo("");
      setTo("");
      setSentBy("");
      setRemarks("");
      fetchOutwards();
    } catch (err) {
      console.log(err);
    }
  };
const formatDate = (dateString) => {
  if (!dateString) return "-";

  const d = new Date(dateString);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return `${String(d.getDate()).padStart(2,"0")}/${months[d.getMonth()]}/${d.getFullYear()}`;
};
  const handleDelete = async (id) => {
    try {
      await API.delete(`/courier/outward/${id}`);
      fetchOutwards();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = outwards.filter((item) =>
    item.recipient.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Courier Outward Entry</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <label className="block font-medium mb-2">Courier No</label>
        <input
          type="text"
          value={courierNo}
          onChange={(e) => setCourierNo(e.target.value)}
          placeholder="Courier number"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block font-medium mb-2">To</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Recipient"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block font-medium mb-2">Sent By</label>
        <input
          type="text"
          value={sentBy}
          onChange={(e) => setSentBy(e.target.value)}
          placeholder="Sent by"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block font-medium mb-2">Remarks</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Remarks"
          className="w-full border p-4 rounded-lg mb-6 h-28"
        />

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Save Outward
          </button>

          <button
            onClick={() => {
              setCourierNo("");
              setTo("");
              setSentBy("");
              setRemarks("");
            }}
            className="border px-6 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      {/* OUTWARD LIST */}
<div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

  <input
    type="text"
    placeholder="Search outward..."
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
            {formatDate(item.created_at)}
          </span>
        </div>

        <div className="text-sm space-y-1">
          <p><strong>To:</strong> {item.recipient}</p>
          <p><strong>Sent By:</strong> {item.sent_by}</p>
          <p><strong>Remarks:</strong> {item.remarks || "-"}</p>
        </div>

        <button
          onClick={() => handleDelete(item.id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
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
          <th className="px-2">To</th>
          <th className="px-2">Sent By</th>
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
            <td className="px-2">{item.recipient}</td>
            <td className="px-2">{item.sent_by}</td>
            <td className="px-2">{item.remarks || "-"}</td>
            <td className="px-2">
              {formatDate(item.created_at)}
            </td>
            <td className="align-middle">
            <td>
              <button
                onClick={() => handleDelete(item.id)}
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
    </AdminLayout>
  );
}

export default CourierOutward;
