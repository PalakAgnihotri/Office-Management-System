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

  const handleSave = async () => {
    if (!title || !category || !content) {
      alert("Fill all fields");
      return;
    }

    try {
      await API.post("/notes", {
        title,
        category,
        content
      });

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
      <h1 className="text-2xl font-bold mb-6">Notes</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
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
          className="w-full border p-4 rounded-lg mb-6 h-28"
        />

        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-teal-600 text-white px-6 py-2 rounded-lg"
          >
            Save Note
          </button>

          <button
            onClick={() => {
              setTitle("");
              setCategory("");
              setContent("");
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
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-3 rounded-lg w-1/2"
          />
        </div>

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
              <tr key={note.id} className="border-b">
                <td className="py-3">{note.title}</td>
                <td>{note.category}</td>
                <td>
                  {new Date(note.created_at).toLocaleDateString()}
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(note.id)}
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

export default Notes;
