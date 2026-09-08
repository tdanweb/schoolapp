import { AlertMessage } from "../components/LogInForm";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaPlusCircle, FaSave, FaTimes, FaImages } from "react-icons/fa";

import { mainApi } from "../api";
import { Input } from "../components/LogInForm";

const audiences = [
  "student",
  "parent",
  "admin",
  "admin2",
  "staff",
  "chief-admin",
  "applicant",
];


const postTypes = [
  "blog",
  "events",
  "discussion",
  "award",
  "other",
];

export default function ManagePosts() {
  const [mode, setMode] = useState("update");
  const [theUser, setTheUser] = useState({});
  
  // Short update
  const [update, setUpdate] = useState({
    title: "",
    body: "",
  });

  const [audience, setAudience] = useState([
    "admin",
    "admin2",
    "chief-admin",
  ]);

  const [updateAlertMsg, setUpdateAlertMsg] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // Blog
  const [blog, setBlog] = useState({
    title: "",
    content: "",
    type: "blog",
  });

  const [files, setFiles] = useState([]);
  const [blogAlertMsg, setBlogAlertMsg] = useState("");
  const [blogLoading, setBlogLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("logged-user"));
    if (!user) return;

    setTheUser(user);
  }, []);

  // Toggle audience
  function toggleAudience(item) {
    setAudience((prev) =>
      prev.includes(item)
        ? prev.filter((aud) => aud !== item)
        : [...prev, item]
    );
  }

  // Select images
  function handleFileChange(e) {
    if (!e.target.files) return;

    setFiles((prev) => [
      ...prev,
      ...Array.from(e.target.files),
    ]);
  }

  function removeFile(index) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // -------------------------
  // SHORT UPDATE
  // -------------------------
  async function makeUpdate(e) {
    e.preventDefault();

    if (audience.length === 0) {
      setUpdateAlertMsg("Please select at least one target audience.");
      return;
    }

    setUpdateLoading(true);


    try {
      const data = {
        title: update.title,
        body: update.body,
        audience,
        regNo: "SCH0001"
      }

      const res = await axios.post(
        `${mainApi}/update/post`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${theUser?.token}`,
          },
        }  
      );

      setUpdateAlertMsg(
        res.data.msg || "Short update created successfully."
      );

      setUpdate({
        title: "",
        body: "",
      });

    } catch (error) {
      setUpdateAlertMsg(
        error.response?.data?.msg || "Unable to create update."
      );
    } finally {
      setUpdateLoading(false);
    }
  }

  // -------------------------
  // BLOG POST
  // -------------------------
  async function makeBlogPost(e) {
    e.preventDefault();

    setBlogLoading(true);

    const formData = new FormData();

    formData.append("title", blog.title);
    formData.append("content", blog.content);
    formData.append("type", blog.type);
    formData.append(
      "regNo",
      theUser?.user || theUser?.username || "SCH0001"
    );

    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const res = await axios.post(
        `${mainApi}/setting/post/home/${theUser?.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: theUser?.token,
          },
        }
      );

      setBlogAlertMsg(
        res.data.msg || "Blog post created successfully."
      );

      setBlog({
        title: "",
        content: "",
        type: "blog",
      });

      setFiles([]);
    } catch (error) {
      setBlogAlertMsg(
        error.response?.data?.msg || "Unable to create blog post."
      );
    } finally {
      setBlogLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4">

      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-slate-800">
          Post Management
        </h2>

        <p className="text-sm text-slate-500">
          Create and manage school updates and blog posts.
        </p>
      </div>

      {/* MODE SWITCH */}
      <div className="flex p-1 mb-6 bg-slate-100 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => setMode("update")}
          className={`px-5 py-2 rounded-md text-sm font-semibold transition ${
            mode === "update"
              ? "bg-white text-slate-800 shadow"
              : "text-slate-500"
          }`}
        >
          Short Update
        </button>

        <button
          type="button"
          onClick={() => setMode("blog")}
          className={`px-5 py-2 rounded-md text-sm font-semibold transition ${
            mode === "blog"
              ? "bg-white text-slate-800 shadow"
              : "text-slate-500"
          }`}
        >
          Blog Post
        </button>
      </div>

      {/* ================= SHORT UPDATE ================= */}
      {mode === "update" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
        >
          {updateAlertMsg && (
            <AlertMessage
              msg={updateAlertMsg}
              click={() => setUpdateAlertMsg("")}
              zed={60}
            />
          )}

          <div className="border-b border-slate-200 pb-3 mb-5">
            <h3 className="font-bold text-lg text-slate-800">
              Create Short Update
            </h3>

            <p className="text-xs text-slate-500">
              Send a short announcement to selected audiences.
            </p>
          </div>

          <form onSubmit={makeUpdate} className="space-y-5">

            <Input
              type="text"
              required
              label="Title"
              minLength={10}
              maxLength={150}
              placeholder="Enter update title"
              value={update.title}
              onChange={(e) =>
                setUpdate({
                  ...update,
                  title: e.target.value,
                })
              }
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Update Content
              </label>

              <textarea
                required
                minLength={30}
                maxLength={1000}
                rows={6}
                value={update.body}
                onChange={(e) =>
                  setUpdate({
                    ...update,
                    body: e.target.value,
                  })
                }
                placeholder="Write your update..."
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* AUDIENCE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Target Audience
              </label>

              <div className="flex flex-wrap gap-2">
                {audiences.map((item) => {
                  const selected = audience.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleAudience(item)}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition ${
                        selected
                          ? "bg-slate-700 text-white border-slate-700"
                          : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                      }`}
                    >
                      {item.toUpperCase()}
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-slate-400 mt-2">
                {audience.length} audience
                {audience.length !== 1 && "s"} selected
              </p>
            </div>

            <button
              disabled={updateLoading}
              type="submit"
              className="w-full py-2.5 rounded-lg bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 text-white font-semibold flex justify-center items-center gap-2"
            >
              {updateLoading ? "SAVING..." : "SAVE UPDATE"}
              <FaSave />
            </button>
          </form>
        </motion.div>
      )}

      {/* ================= BLOG POST ================= */}
      {mode === "blog" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm"
        >
          {blogAlertMsg && (
            <AlertMessage
              msg={blogAlertMsg}
              click={() => setBlogAlertMsg("")}
              zed={60}
            />
          )}

          <div className="border-b border-slate-200 pb-3 mb-5">
            <h3 className="font-bold text-lg text-slate-800">
              Create Blog Post
            </h3>

            <p className="text-xs text-slate-500">
              Create a full post with images and select its category.
            </p>
          </div>

          <form onSubmit={makeBlogPost} className="space-y-5">

            <Input
              type="text"
              required
              label="Post Title"
              minLength={20}
              maxLength={150}
              placeholder="Enter post title"
              value={blog.title}
              onChange={(e) =>
                setBlog({
                  ...blog,
                  title: e.target.value,
                })
              }
            />

            {/* POST TYPE */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Post Type
              </label>

              <select
                value={blog.type}
                onChange={(e) =>
                  setBlog({
                    ...blog,
                    type: e.target.value,
                  })
                }
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                {postTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* CONTENT */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Post Content
              </label>

              <textarea
                required
                minLength={50}
                rows={9}
                value={blog.content}
                onChange={(e) =>
                  setBlog({
                    ...blog,
                    content: e.target.value,
                  })
                }
                placeholder="Write your blog post..."
                className="w-full p-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

{/* IMAGES */}
<div>
  <div className="flex items-center justify-between mb-2">
    <label className="text-sm font-semibold text-slate-700">
      Images
    </label>

    <span className="text-xs font-medium text-slate-500">
      {files.length} {files.length === 1 ? "image" : "images"} selected
    </span>
  </div>

  {/* Upload Area */}
  <label
    htmlFor="image-upload"
    className="
      group relative flex flex-col items-center justify-center
      w-full min-h-[150px] px-6 py-7
      rounded-2xl border-2 border-dashed border-slate-200
      bg-slate-50/70
      cursor-pointer
      transition-all duration-200
      hover:border-indigo-400 hover:bg-indigo-50/40
    "
  >
    <div
      className="
        flex items-center justify-center
        w-12 h-12 mb-3
        rounded-xl bg-white shadow-sm
        text-indigo-600
        group-hover:scale-105 transition-transform
      "
    >
      <FaImages size={22} />
    </div>

    <p className="text-sm font-semibold text-slate-700">
      Click to select images
    </p>

    <p className="mt-1 text-xs text-slate-400">
      PNG, JPG, JPEG or WebP • Multiple images allowed
    </p>

    <input
      id="image-upload"
      type="file"
      multiple
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  </label>

  {/* Selected Images */}
  {files.length > 0 && (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Selected images
        </span>

        <button
          type="button"
          onClick={() => files.forEach((_, i) => removeFile(i))}
          className="text-xs font-medium text-red-500 hover:text-red-600"
        >
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="
              group relative aspect-square
              overflow-hidden rounded-xl
              border border-slate-200
              bg-slate-100
              shadow-sm
            "
          >
            <img
              src={URL.createObjectURL(file)}
              alt={`Preview ${index + 1}`}
              className="
                w-full h-full object-cover
                transition-transform duration-300
                group-hover:scale-105
              "
            />

            {/* Overlay */}
            <div className="
              absolute inset-0
              bg-black/0 group-hover:bg-black/20
              transition-colors
            " />

            {/* Remove */}
            <button
              type="button"
              onClick={() => removeFile(index)}
              className="
                absolute top-1.5 right-1.5
                flex items-center justify-center
                w-7 h-7
                rounded-full
                bg-white/95 text-red-500
                shadow-md
                opacity-0 group-hover:opacity-100
                transition-all
                hover:bg-red-500 hover:text-white
              "
              title="Remove image"
            >
              <FaTimes size={11} />
            </button>

            {/* Image number */}
            <span className="
              absolute bottom-1.5 left-1.5
              px-1.5 py-0.5
              rounded-md
              bg-black/60 text-white
              text-[10px] font-semibold
            ">
              {index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  )}
</div>
            <button
              disabled={blogLoading}
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-700 hover:bg-sky-800 disabled:bg-slate-400 text-white font-semibold flex justify-center items-center gap-2"
            >
              {blogLoading ? "UPLOADING..." : "PUBLISH POST"}
              <FaPlusCircle />
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}