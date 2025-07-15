import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmitFeedback: React.FC = () => {
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
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
        { content },
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Submit Feedback</h2>

        {message && (
          <p className="text-center text-sm mb-4 text-red-600">{message}</p>
        )}

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter your feedback"
          required
          className="w-full p-3 border rounded mb-4"
          rows={5}
        ></textarea>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitFeedback;
