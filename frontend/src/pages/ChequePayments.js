import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function ChequePayments() {
  const [cheques, setCheques] = useState([]);
  const [chequeNo, setChequeNo] = useState("");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [bank, setBank] = useState("");
  const [date, setDate] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCheques();
  }, []);

  const fetchCheques = async () => {
    try {
      const res = await API.get("/cheques");
      setCheques(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSave = async () => {
    if (!chequeNo || !payee || !amount || !bank || !date)
      return alert("Fill all fields");

    try {
      await API.post("/cheques", {
        cheque_no: chequeNo,
        payee,
        amount,
        bank,
        cheque_date: date
      });

      alert("Saved successfully");
      setChequeNo("");
      setPayee("");
      setAmount("");
      setBank("");
      setDate("");
      fetchCheques();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    await API.delete(`/cheques/${id}`);
    fetchCheques();
  };

  const filtered = cheques.filter((c) =>
    c.payee.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">Cheque Payments</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">

        <label className="block mb-2">Cheque No</label>
        <input
          type="text"
          value={chequeNo}
          onChange={(e) => setChequeNo(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2">Payee</label>
        <input
          type="text"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2">Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2">Bank</label>
        <input
          type="text"
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block mb-2">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border p-3 rounded-lg mb-6"
        />

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg"
          >
            Save Payment
          </button>

          <button
            onClick={() => {
              setChequeNo("");
              setPayee("");
              setAmount("");
              setBank("");
              setDate("");
            }}
            className="border px-6 py-2 rounded-lg"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABLE */}
      {/* PAYMENTS LIST */}
<div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

  <input
    type="text"
    placeholder="Search payments..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
  />

  {/* ================= MOBILE VIEW (CARDS) ================= */}
  <div className="sm:hidden space-y-4">
    {filtered.map((c) => (
      <div
        key={c.id}
        className="border rounded-xl p-4 shadow-sm bg-gray-50"
      >
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">
            ₹ {c.amount}
          </h2>
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
            Cheque #{c.cheque_no}
          </span>
        </div>

        <div className="text-sm space-y-1">
          <p><strong>Payee:</strong> {c.payee}</p>
          <p><strong>Bank:</strong> {c.bank}</p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(c.cheque_date).toLocaleDateString()}
          </p>
        </div>

        <button
          onClick={() => handleDelete(c.id)}
          className="text-red-600 mt-4 font-medium"
        >
          Delete Payment
        </button>
      </div>
    ))}
  </div>

  {/* ================= DESKTOP TABLE ================= */}
  <div className="hidden sm:block overflow-x-auto">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">
          <th className="py-3 px-2">Cheque No</th>
          <th className="px-2">Payee</th>
          <th className="px-2">Bank</th>
          <th className="px-2">Amount</th>
          <th className="px-2">Date</th>
          <th className="px-2">Action</th>
        </tr>
      </thead>

      <tbody>
        {filtered.map((c) => (
          <tr
            key={c.id}
            className="border-b hover:bg-gray-50 transition"
          >
            <td className="py-3 px-2">
              {c.cheque_no}
            </td>
            <td className="px-2">
              {c.payee}
            </td>
            <td className="px-2">
              {c.bank}
            </td>
            <td className="px-2 font-semibold">
              ₹ {c.amount}
            </td>
            <td className="px-2">
              {new Date(c.cheque_date).toLocaleDateString()}
            </td>
            <td
              onClick={() => handleDelete(c.id)}
              className="px-2 text-red-600 cursor-pointer hover:underline"
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

export default ChequePayments;