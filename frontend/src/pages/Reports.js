import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function Reports() {
  const [activeReport, setActiveReport] = useState(null);

  const [inward, setInward] = useState([]);
  const [outward, setOutward] = useState([]);
  const [notes, setNotes] = useState([]);
  const [cheques, setCheques] = useState([]);

  useEffect(() => {
    if (activeReport === "inward") fetchInward();
    if (activeReport === "outward") fetchOutward();
    if (activeReport === "notes") fetchNotes();
    if (activeReport === "cheques") fetchCheques();
  }, [activeReport]);

  const fetchInward = async () => {
    const res = await API.get("/courier/inward");
    setInward(res.data);
  };

  const fetchOutward = async () => {
    const res = await API.get("/courier/outward");
    setOutward(res.data);
  };

  const fetchNotes = async () => {
    const res = await API.get("/notes");
    setNotes(res.data);
  };

  const fetchCheques = async () => {
    const res = await API.get("/cheques");
    setCheques(res.data);
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-8">Reports</h1>

      {/* Sub Modules */}
      {!activeReport && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <button
            onClick={() => setActiveReport("inward")}
            className="bg-white p-6 rounded-xl shadow hover:bg-gray-100 text-left"
          >
            <h2 className="font-semibold text-lg">
              Courier Inward Report
            </h2>
          </button>

          <button
            onClick={() => setActiveReport("outward")}
            className="bg-white p-6 rounded-xl shadow hover:bg-gray-100 text-left"
          >
            <h2 className="font-semibold text-lg">
              Courier Outward Report
            </h2>
          </button>

          <button
            onClick={() => setActiveReport("notes")}
            className="bg-white p-6 rounded-xl shadow hover:bg-gray-100 text-left"
          >
            <h2 className="font-semibold text-lg">
              Notes Report
            </h2>
          </button>

          <button
            onClick={() => setActiveReport("cheques")}
            className="bg-white p-6 rounded-xl shadow hover:bg-gray-100 text-left"
          >
            <h2 className="font-semibold text-lg">
              Cheque Payments Report
            </h2>
          </button>

        </div>
      )}

      {/* Back Button */}
      {activeReport && (
        <button
          onClick={() => setActiveReport(null)}
          className="mb-6 bg-gray-300 px-4 py-2 rounded-lg"
        >
          ← Back
        </button>
      )}

      {/* Report Display Section */}

      {activeReport === "inward" && (
        <div className="bg-white p-6 rounded-xl shadow max-h-[500px] overflow-y-auto">
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
      )}

      {activeReport === "outward" && (
        <div className="bg-white p-6 rounded-xl shadow max-h-[500px] overflow-y-auto">
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
      )}

      {activeReport === "notes" && (
        <div className="bg-white p-6 rounded-xl shadow max-h-[500px] overflow-y-auto">
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
      )}

      {activeReport === "cheques" && (
        <div className="bg-white p-6 rounded-xl shadow max-h-[500px] overflow-y-auto">
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
      )}

    </AdminLayout>
  );
}

export default Reports;