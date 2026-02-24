import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function ChequeReport() {

  const [cheques, setCheques] = useState([]);
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

  /* SEARCH FILTER */
  const filtered = cheques.filter((c) =>
    c.payee?.toLowerCase().includes(search.toLowerCase()) ||
    c.cheque_no?.toLowerCase().includes(search.toLowerCase()) ||
    c.bank?.toLowerCase().includes(search.toLowerCase())
  );

  /* TOTAL AMOUNT */
  const totalAmount = filtered.reduce(
    (sum, c) => sum + Number(c.amount || 0),
    0
  );

  return (
    <AdminLayout>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3">

        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Cheque Payments Report
        </h1>

        <div className="text-sm sm:text-base font-semibold text-purple-600">
          Total: ₹ {totalAmount.toLocaleString()}
        </div>

      </div>


      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search cheque no, payee, or bank..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
        />


        {/* ================= MOBILE VIEW ================= */}

        <div className="sm:hidden space-y-4">

          {filtered.length === 0 && (
            <p className="text-gray-500">No cheque records found</p>
          )}

          {filtered.map((c) => (

            <div
              key={c.id}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >

              <div className="flex justify-between items-center mb-2">

                <h2 className="font-semibold text-lg">
                  ₹ {Number(c.amount).toLocaleString()}
                </h2>

                <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                  #{c.cheque_no}
                </span>

              </div>


              <div className="text-sm space-y-1">

                <p>
                  <strong>Payee:</strong> {c.payee}
                </p>

                <p>
                  <strong>Bank:</strong> {c.bank}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {c.cheque_date
                    ? new Date(c.cheque_date).toLocaleDateString("en-IN")
                    : "-"}
                </p>

              </div>

            </div>

          ))}

        </div>


        {/* ================= DESKTOP TABLE ================= */}

        <div className="hidden sm:block overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">

                <th className="p-4">Cheque No</th>
                <th className="p-4">Payee</th>
                <th className="p-4">Bank</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>

              </tr>

            </thead>


            <tbody>

              {filtered.map((c) => (

                <tr
                  key={c.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {c.cheque_no}
                  </td>

                  <td className="p-4">
                    {c.payee}
                  </td>

                  <td className="p-4">
                    {c.bank}
                  </td>

                  <td className="p-4 font-semibold text-purple-600">
                    ₹ {Number(c.amount).toLocaleString()}
                  </td>

                  <td className="p-4">
                    {c.cheque_date
                      ? new Date(c.cheque_date)
                          .toLocaleDateString("en-IN")
                      : "-"}
                  </td>

                </tr>

              ))}

            </tbody>


            {/* TOTAL ROW */}

            <tfoot>

              <tr className="bg-gray-50 font-semibold">

                <td className="p-4" colSpan="3">
                  Total
                </td>

                <td className="p-4 text-purple-700">
                  ₹ {totalAmount.toLocaleString()}
                </td>

                <td></td>

              </tr>

            </tfoot>

          </table>

        </div>


      </div>

    </AdminLayout>
  );
}

export default ChequeReport;