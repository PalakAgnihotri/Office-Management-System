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
      <h1 className="text-2xl font-bold mb-6">Courier Outward Entry</h1>

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
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search outward..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-1/2"
          />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">No</th>
              <th>To</th>
              <th>Sent By</th>
              <th>Remarks</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{index + 1}</td>
                <td>{item.recipient}</td>
                <td>{item.sent_by}</td>
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

export default CourierOutward;
