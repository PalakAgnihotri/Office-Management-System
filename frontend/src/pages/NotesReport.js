import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function NotesReport() {

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await API.get("/notes");
      setNotes(res.data);
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
  const filtered = notes.filter((note) =>
    note.title?.toLowerCase().includes(search.toLowerCase()) ||
    note.category?.toLowerCase().includes(search.toLowerCase()) ||
    note.content?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>

      {/* HEADER */}
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        Notes Report
      </h1>


      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search by title, category, or content..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
        />


        {/* ================= MOBILE VIEW ================= */}

        <div className="sm:hidden space-y-4">

          {filtered.length === 0 && (
            <p className="text-gray-500">No notes found</p>
          )}

          {filtered.map((note) => (

            <div
              key={note.id}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >

              <div className="flex justify-between items-center mb-2">

                <h2 className="font-semibold text-lg">
                  {note.title}
                </h2>

                <span className="text-xs bg-teal-100 text-teal-600 px-2 py-1 rounded-full">
                  {note.category}
                </span>

              </div>


              <p className="text-sm text-gray-600 mb-2 line-clamp-3">
                {note.content}
              </p>


              <p className="text-xs text-gray-500">
                {
                  formatDate(note.created_at)
                    }
              </p>

            </div>

          ))}

        </div>


        {/* ================= DESKTOP TABLE ================= */}

        <div className="hidden sm:block overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>

              <tr className="border-b bg-gray-50 text-gray-600 text-sm uppercase">

                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Content</th>
                <th className="p-4">Date</th>

              </tr>

            </thead>


            <tbody>

              {filtered.map((note) => (

                <tr
                  key={note.id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {note.title}
                  </td>

                  <td className="p-4">
                    <span className="bg-teal-100 text-teal-600 px-2 py-1 rounded-full text-xs">
                      {note.category}
                    </span>
                  </td>

                  <td className="p-4 max-w-md truncate">
                    {note.content}
                  </td>

                  <td className="p-4">
                    {
                      formatDate(note.created_at)
                          }
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

export default NotesReport;