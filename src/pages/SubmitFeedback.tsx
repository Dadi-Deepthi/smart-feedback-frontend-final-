import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const SubmitFeedback: React.FC = () => {
  const [content, setContent] = useState("");
  const [department, setDepartment] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      setMessage("No token found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5271/api/Feedback/submit",
        { content, department },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.status === 200) {
        setMessage("✅ Feedback submitted successfully.");
        setContent("");
        setDepartment("");
      } else {
        setMessage("Unexpected error occurred.");
      }
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      if (err.response?.status === 401) {
        setMessage("⚠️ Unauthorized. Please login again.");
        navigate("/login");
      } else if (err.response?.status === 400) {
        setMessage("⚠️ Bad request. Please check your input.");
      } else {
        setMessage("❌ Failed to submit feedback.");
      }
    }
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const bgImage =
    "https://media.istockphoto.com/id/1458453953/photo/focus-group-feedback-evaluation-and-research.jpg?s=1024x1024&w=is&k=20&c=etTuPfzSDFb_NT8ekXB3G92NUpkk1a1sE6H-s-Avzns=";

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center p-4"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          ✍️ Submit Feedback
        </h2>
        <p className="text-center text-gray-600 mb-6">
          👋 Welcome, <strong>{username}</strong>
        </p>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm mb-4 text-red-600"
          >
            {message}
          </motion.p>
        )}

        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your feedback"
            required
            className="w-full p-3 border rounded mb-4"
            rows={5}
          ></textarea>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
            className="w-full p-3 border rounded mb-6"
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="IT">IT</option>
            <option value="Finance">Finance</option>
            <option value="Operations">Operations</option>
          </select>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded transition"
            >
              ◀️ Back
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
            >
              🚀 Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitFeedback;
