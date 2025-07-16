import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5271/api/Feedback/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setFeedbacks(res.data);
      })
      .catch((err) => {
        console.error("Error fetching feedbacks:", err);
      });
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSubmitFeedback = () => {
    navigate("/submit");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome, {role}</h1>

        <div className="space-x-3">
          <button
            onClick={handleSubmitFeedback}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Submit Feedback
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-3">Feedback List:</h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedbacks available.</p>
      ) : role === "Admin" ? (
        // ✅ Admin view: grouped by department
        <div className="space-y-6">
          {feedbacks.map((group: any, index: number) => (
            <div key={index}>
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                Department: {group.department}
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {group.feedbacks.map((fb: any) => (
                  <li key={fb.id} className="bg-gray-100 p-4 rounded shadow-sm">
                    <p className="mb-1">
                      <strong>Content:</strong> {fb.content}
                    </p>
                    <p className="mb-1">
                      <strong>Sentiment:</strong> {fb.sentiment}
                    </p>
                    <p className="mb-1">
                      <strong>Department:</strong> {fb.department}
                    </p>
                    <p>
                      <strong>User:</strong> {fb.username}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        // ✅ User view: flat list
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {feedbacks.map((fb: any) => (
            <li key={fb.id} className="bg-gray-100 p-4 rounded shadow-sm">
              <p className="mb-1">
                <strong>Content:</strong> {fb.content}
              </p>
              <p className="mb-1">
                <strong>Sentiment:</strong> {fb.sentiment}
              </p>
              <p className="mb-1">
                <strong>Department:</strong> {fb.department}
              </p>
              <p>
                <strong>User:</strong> {fb.username}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
