import { useState } from "react";
import axios from "axios";
import { mainApi } from "../api";

export default function UploadFile() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg"
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Only JPG and PNG files are allowed.");
      setFile(null);
      return;
    }

    setError("");
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image")) {
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file:", file);

      const response = await axios.post(
        `${mainApi}/media/add`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        });

      console.log(response.data.public_id)
      setUploadedFile(response.data.url);
          } 
    catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Upload failed. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">
          Upload File
        </h2>

        <label className="block">
          <span className="text-sm font-medium text-gray-700">
            Select 
          </span>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full border rounded-lg p-2 text-sm
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-blue-600 file:text-white
            hover:file:bg-blue-700"
          />
        </label>

        {file && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium">
              Selected:
            </p>

            <p className="text-sm text-gray-600 break-all">
              {file.name}
            </p>
          </div>
        )}

        {preview && (
          <div className="mt-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-52 object-cover rounded-lg border"
            />
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-5 w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-60"
        >
          {uploading ? "Uploading..." : "Upload File"}
        </button>

        {uploadedFile && (
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-green-600 mb-3">
              Upload Successful 🎉
            </h3>

            {uploadedFile.fileType?.startsWith("image") && (
              <img
                src={uploadedFile.url}
                alt="Uploaded"
                className="w-full h-52 object-cover rounded-lg border"
              />
            )}

            <a
              href={uploadedFile.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-blue-600 break-all hover:underline"
            >
              View Uploaded File
            </a>
          </div>
        )}
      </div>
    </div>
  );
}


export function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file); // Matches upload.single('file') in backend

    setLoading(true);
    try {
      // Axios automatically sets the correct 'multipart/form-data' headers when passing FormData
      const response = await axios.post('http://localhost:5000/api/media/add', formData);
      
      setUploadedUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading:', error.response?.data || error.message);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <form onSubmit={handleUpload}>
        <input 
          type="file" 
          accept="image/*,application/pdf" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {uploadedUrl && (
        <div style={{ marginTop: '20px' }}>
          <p>Uploaded Successfully!</p>
          <a href={uploadedUrl} target="_blank" rel="noreferrer">View Uploaded File</a>
        </div>
      )}
    </div>
  );
}