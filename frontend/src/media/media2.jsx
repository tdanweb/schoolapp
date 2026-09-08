import { useState, useEffect } from "react";
import axios from "axios";
import imageCompression from "browser-image-compression";

export function UploadImages({api, form}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleImage = async (e) => {
  setImageUrl("");
  const file = e.target.files[0]
  if (!file) return;

  // Reject if original is already too large
  if (file.size > 1 * 1024 * 1024) {
    alert("Image must not exceed 1MB");
    return;
  }

  const options = {
    maxSizeMB: 0.8,          // target max ~800KB
    maxWidthOrHeight: 1200,  // resize large images
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    console.log("Original:", file.size);
    console.log("Compressed:", compressedFile.size);
    setFile(compressedFile);

    /*
    // Send compressedFile to your backend
    const formData = new FormData();
    formData.append("image", compressedFile);

    await axios.post("/api/upload", formData);
    */
  } catch (error) {
    console.error(error);
  }
};

  const uploadImage = async () => {
    if (!file) {
      setMessage("Please select an image.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setProgress(0);

      const formData = new FormData();
      formData.append("image", file);

      const { data } = await axios.post(
        "http://localhost:5000/api/media/add",
        formData,
        {
          onUploadProgress: (event) => {
            const percent = Math.round(
              (event.loaded * 100) / event.total
            );
            setProgress(percent);
          },
        }
      );

      setImageUrl(data.url);
      setMessage("Image uploaded successfully!");
      console.log(data)
    } catch (err) {
      console.log(err);
      setMessage(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-5">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2">
          Cloudinary Image Upload
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Upload an image and preview it before sending.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT */}
          <div>
            <label className="border-2 border-dashed border-blue-400 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 text-blue-500 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>

              <span className="font-semibold text-gray-700">
                Click to choose image
              </span>

              <span className="text-sm text-gray-500 mt-1">
                JPG • PNG • JPEG • WEBP
              </span>

              <input
                hidden
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImage}
              />
            </label>

            {preview && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2 text-gray-700">
                  Preview Before Upload
                </h3>

                <img
                  src={preview}
                  alt=""
                  className="rounded-xl shadow-md w-full h-72 object-cover"
                />

                <div className="flex gap-3 mt-4">

                  <button
                    onClick={uploadImage}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold disabled:opacity-60"
                  >
                    {loading ? "Uploading..." : "Upload Image"}
                  </button>

                  <button
                    onClick={() => {
                      setFile(null);
                      setPreview("");
                    }}
                    className="px-5 rounded-xl border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition"
                  >
                    Remove
                  </button>

                </div>

                {loading && (
                  <div className="mt-5">

                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">

                      <div
                        className="bg-blue-600 h-full transition-all"
                        style={{ width: `${progress}%` }}
                      />

                    </div>

                    <p className="text-center mt-2 text-sm">
                      {progress}%
                    </p>

                  </div>
                )}

              </div>
            )}

          </div>

          {/* RIGHT */}
          <div>

            <h3 className="font-semibold text-gray-700 mb-3">
              Uploaded Image
            </h3>

            <div className="border rounded-2xl h-[420px] flex items-center justify-center bg-gray-50">

              {imageUrl ? (
                <img
                  src={getOptimizedImage(imageUrl)}
                  alt=""
                  className="rounded-xl w-full h-full object-cover"
                />
              ) : (
                <p className="text-gray-400">
                  Uploaded image will appear here
                </p>
              )}

            </div>

            {imageUrl && (
              <div className="mt-5">

                <label className="text-sm text-gray-600">
                  Image URL
                </label>

                <input
                  readOnly
                  value={imageUrl}
                  className="mt-2 w-full border rounded-lg p-3 bg-gray-100 text-sm"
                />

              </div>
            )}

          </div>

        </div>

        {message && (
          <div
            className={`mt-8 p-4 rounded-xl text-center font-medium ${
              imageUrl
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}



export const handleImageToUpload = async (file) => {
  if (!file) return;

  // Reject if original is already too large
  if (file.size > 1 * 1024 * 1024) {
    alert("Image must not exceed 1MB");
    return;
  }

  const options = {
    maxSizeMB: 0.8,          // target max ~800KB
    maxWidthOrHeight: 1200,  // resize large images
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);

    console.log("Original:", file.size);
    console.log("Compressed:", compressedFile.size);
    return(compressedFile)
  } catch (error) {
    console.error(error);
    return alert("Error occurred!")
  }
};

//cloudinary optimizer
const getOptimizedImage = (url) => {
  if (!url) return ""

  return url.replace(
    "/upload/",
    "/upload/w_1200,c_limit,q_auto,f_auto/"
  );
};

export {getOptimizedImage};