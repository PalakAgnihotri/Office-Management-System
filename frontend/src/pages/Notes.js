import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function Notes() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
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

  const handleSave = async () => {
    if (!title || !category || !content) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/notes", { title, category, content });
      alert("Note saved successfully");
      setTitle("");
      setCategory("");
      setContent("");
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/${id}`);
      fetchNotes();
    } catch (err) {
      console.log(err);
    }
  };

  const filtered = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6">
        Notes
      </h1>

      {/* FORM */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow mb-6 sm:mb-8">
        <label className="block font-medium mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block font-medium mb-2">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block font-medium mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note..."
          className="w-full border p-3 rounded-lg mb-4 h-28"
        />

        {/* Buttons responsive */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
          >
            Save Note
          </button>

          <button
            onClick={() => {
              setTitle("");
              setCategory("");
              setContent("");
            }}
            className="border px-6 py-2 rounded-lg w-full sm:w-auto"
          >
            Clear
          </button>
        </div>
      </div>

      {/* NOTES LIST */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow">

        {/* Search */}
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-full sm:w-1/2 mb-6"
        />

        {/* MOBILE VIEW (cards) */}
        <div className="sm:hidden space-y-4">
          {filtered.map((note) => (
            <div
              key={note.id}
              className="border rounded-xl p-4 shadow-sm bg-gray-50"
            >
              <h2 className="font-semibold text-lg">
                {note.title}
              </h2>

              <p className="text-sm text-gray-600">
                Category: {note.category}
              </p>

              <p className="text-sm text-gray-600">
                Date:{" "}
                {formatDate(note.created_at)}
              </p>

              <button
                onClick={() => handleDelete(note.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* DESKTOP TABLE */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3">Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((note) => (
                <tr key={note.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{note.title}</td>
                  <td>{note.category}</td>
                  <td>
                    {formatDate(note.created_at)}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(note.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
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

export default Notes;