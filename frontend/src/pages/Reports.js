import { useEffect, useState } from "react";
import API from "../services/api";
import AdminLayout from "../layouts/AdminLayout";

function Reports() {
  const [clientName, setClientName] = useState("");
  const [docType, setDocType] = useState("");
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await API.get("/reports");
      setDocuments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpload = async () => {
  if (!clientName || !docType || !file) {
    alert("Fill all fields");
    return;
  }

  const formData = new FormData();
  formData.append("client_name", clientName);
  formData.append("document_type", docType);
  formData.append("file", file);

  try {
    await API.post("/reports/upload", formData);

    alert("Uploaded successfully");

    setClientName("");
    setDocType("");
    setFile(null);

    fetchDocuments();
  } catch (err) {
    console.log("UPLOAD ERROR:", err.response?.data || err.message);
  }
};

  const handleDelete = async (id) => {
    await API.delete(`/reports/${id}`);
    fetchDocuments();
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h2 className="font-semibold mb-4">Upload Document</h2>

        <div className="flex gap-4 mb-4">
          <input
            type="text"
            placeholder="Client Name"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="border p-3 rounded-lg w-1/3"
          />

          <input
            type="text"
            placeholder="Document Type"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="border p-3 rounded-lg w-1/3"
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-3 rounded-lg w-1/3"
          />
        </div>

        <button
          onClick={handleUpload}
          className="bg-teal-600 text-white px-6 py-2 rounded-lg"
        >
          Upload Document
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Client</th>
              <th>Type</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-b">
                <td>{doc.client_name}</td>
                <td>{doc.document_type}</td>
                <td>{doc.status}</td>
                <td>
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td>
                  <a
                    href={`http://localhost:5000/uploads/${doc.file_path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 mr-3"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="text-red-600"
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

export default Reports;