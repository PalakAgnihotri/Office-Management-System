import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function Reports() {
  const [inward, setInward] = useState([]);
  const [outward, setOutward] = useState([]);
  const [notes, setNotes] = useState([]);
  const [cheques, setCheques] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const inwardRes = await API.get("/courier/inward");
      const outwardRes = await API.get("/courier/outward");
      const notesRes = await API.get("/notes");
      const chequeRes = await API.get("/cheques");

      setInward(inwardRes.data);
      setOutward(outwardRes.data);
      setNotes(notesRes.data);
      setCheques(chequeRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
  <AdminLayout>
    <h1 className="text-2xl font-bold mb-8">Reports</h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {/* Courier Inward Card */}
      <div className="bg-white p-6 rounded-xl shadow max-h-96 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-4">
          Courier Inward Report
        </h2>

        {inward.length === 0 && <p>No inward entries</p>}

        {inward.map((item) => (
          <div key={item.id} className="border-b py-3 text-sm">
            <p><strong>Courier No:</strong> {item.courier_no}</p>
            <p><strong>From:</strong> {item.from_name}</p>
            <p><strong>Received By:</strong> {item.received_by}</p>
            <p><strong>Remarks:</strong> {item.remarks}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Courier Outward Card */}
      <div className="bg-white p-6 rounded-xl shadow max-h-96 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-4">
          Courier Outward Report
        </h2>

        {outward.length === 0 && <p>No outward entries</p>}

        {outward.map((item) => (
          <div key={item.id} className="border-b py-3 text-sm">
            <p><strong>Courier No:</strong> {item.courier_no}</p>
            <p><strong>To:</strong> {item.to_name}</p>
            <p><strong>Sent By:</strong> {item.sent_by}</p>
            <p><strong>Remarks:</strong> {item.remarks}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Notes Card */}
      <div className="bg-white p-6 rounded-xl shadow max-h-96 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-4">
          Notes Report
        </h2>

        {notes.length === 0 && <p>No notes available</p>}

        {notes.map((note) => (
          <div key={note.id} className="border-b py-3 text-sm">
            <p><strong>Title:</strong> {note.title}</p>
            <p><strong>Category:</strong> {note.category}</p>
            <p><strong>Content:</strong> {note.content}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(note.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {/* Cheque Card */}
      <div className="bg-white p-6 rounded-xl shadow max-h-96 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-4">
          Cheque Payments Report
        </h2>

        {cheques.length === 0 && <p>No payments available</p>}

        {cheques.map((cheque) => (
          <div key={cheque.id} className="border-b py-3 text-sm">
            <p><strong>Cheque No:</strong> {cheque.cheque_no}</p>
            <p><strong>Payee:</strong> {cheque.payee}</p>
            <p><strong>Amount:</strong> ₹{cheque.amount}</p>
            <p><strong>Bank:</strong> {cheque.bank}</p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(cheque.created_at).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

    </div>
  </AdminLayout>
);
}

export default Reports;