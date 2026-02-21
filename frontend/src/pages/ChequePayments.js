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
      <h1 className="text-2xl font-bold mb-6">Cheque Payments</h1>

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
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder="Search payments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-1/2"
          />
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Cheque No</th>
              <th>Payee</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b">
                <td className="py-3">{c.cheque_no}</td>
                <td>{c.payee}</td>
                <td>₹ {c.amount}</td>
                <td>
                  {new Date(c.cheque_date).toLocaleDateString()}
                </td>
                <td
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(c.id)}
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

export default ChequePayments;