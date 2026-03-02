import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function CourierOutwardReport() {

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
  const formatDate = (dateString) => {
  if (!dateString) return "-";

  const d = new Date(dateString);

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return `${String(d.getDate()).padStart(2,"0")}/${months[d.getMonth()]}/${d.getFullYear()}`;
};


  /* SEARCH FILTER */

  const filtered = outwards.filter((item) =>
    item.courier_no?.toLowerCase().includes(search.toLowerCase()) ||
    item.recipient?.toLowerCase().includes(search.toLowerCase()) ||
    item.sent_by?.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <AdminLayout>

      {/* HEADER */}

      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        Courier Outward Report
      </h1>


      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

        {/* SEARCH */}

        <input
          type="text"
          placeholder="Search courier outward..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
        />


        {/* ================= MOBILE VIEW ================= */}

        <div className="sm:hidden space-y-4">

          {filtered.length === 0 && (
            <p className="text-gray-500">No outward courier found</p>
          )}


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

                <p>
                  <strong>To:</strong>{" "}
                  {item.recipient || "-"}
                </p>

                <p>
                  <strong>Sent By:</strong>{" "}
                  {item.sent_by || "-"}
                </p>

                <p>
                  <strong>Remarks:</strong>{" "}
                  {item.remarks || "-"}
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

                <th className="p-4">Courier No</th>
                <th className="p-4">To</th>
                <th className="p-4">Sent By</th>
                <th className="p-4">Remarks</th>
                <th className="p-4">Date</th>

              </tr>

            </thead>


            <tbody>

              {filtered.map((item) => (

                <tr
                  key={item.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {item.courier_no}
                  </td>

                  <td className="p-4">
                    {item.recipient || "-"}
                  </td>

                  <td className="p-4">
                    {item.sent_by || "-"}
                  </td>

                  <td className="p-4">
                    {item.remarks || "-"}
                  </td>

                  <td className="p-4">
                    {formatDate(item.created_at)}
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

export default CourierOutwardReport;