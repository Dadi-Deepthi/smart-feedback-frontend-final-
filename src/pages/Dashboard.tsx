import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const bgImage =
  "https://media.istockphoto.com/id/2171674959/photo/consumers-or-customers-give-a-five-star-rating-for-the-highest-satisfaction.jpg?s=1024x1024&w=is&k=20&c=RzET0zKGZmkP-ZDXZLKnGJKYGCtynzsID3utDEOB-WA=";

const departmentIcons: { [key: string]: string } = {
  HR: "👥",
  IT: "💻",
  Finance: "💰",
  Marketing: "📣",
  Sales: "🛍️",
  Other: "📝",
};

const sentimentColors: { [key: string]: string } = {
  Positive: "#22c55e", // green-500
  Negative: "#ef4444", // red-500
  Neutral: "#eab308",  // yellow-500
};

const sentimentTextClasses: { [key: string]: string } = {
  Positive: "text-green-600 font-semibold",
  Negative: "text-red-600 font-semibold",
  Neutral: "text-yellow-600 font-semibold",
};

const Dashboard: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://localhost:5271/api/Feedback/all", {
        headers: { Authorization: `Bearer ${token}` },
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

  // 🧠 Generate Chart Data
  const sentimentData: any[] = [];
  const departmentCount: { [key: string]: number } = {};

  if (Array.isArray(feedbacks)) {
    const flat = role === "Admin"
      ? feedbacks.flatMap((group: any) => group.feedbacks)
      : feedbacks;

    flat.forEach((f: any) => {
      // Sentiment
      const s = f.sentiment;
      const existing = sentimentData.find((d) => d.name === s);
      if (existing) existing.value++;
      else sentimentData.push({ name: s, value: 1 });

      // Department
      if (f.department) {
        departmentCount[f.department] = (departmentCount[f.department] || 0) + 1;
      }
    });
  }

  const deptData = Object.entries(departmentCount).map(([name, count]) => ({
    name,
    count,
  }));

  return (
    <div
      className="min-h-screen bg-cover bg-center p-6"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-indigo-700 animate-pulse">
              🎉 Welcome, {username}
            </h1>
            <p className="text-gray-600 text-sm">Role: {role}</p>
          </div>
          <div className="space-x-3">
            <button
              onClick={handleSubmitFeedback}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full shadow-md transition"
            >
              ✍️ Submit Feedback
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-md transition"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          📊 Feedback Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Sentiment Chart</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {sentimentData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={sentimentColors[entry.name] || "#8884d8"}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="text-lg font-semibold mb-2">Feedback by Department</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={deptData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <h2 className="text-xl font-semibold mb-3 text-gray-700">
          📋 Feedback List
        </h2>

        {feedbacks.length === 0 ? (
          <p className="text-gray-600">No feedbacks available.</p>
        ) : role === "Admin" ? (
          <div className="space-y-10">
            {feedbacks.map((group: any, index: number) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-blue-800 mb-3">
                  {departmentIcons[group.department] || "🏢"}{" "}
                  {group.department} Department
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.feedbacks.map((fb: any) => (
                    <motion.div
                      key={fb.id}
                      className="bg-gradient-to-br from-indigo-100 via-white to-indigo-50 p-4 rounded-xl shadow-lg border-l-4 border-indigo-500"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <p><strong>📝 Content:</strong> {fb.content}</p>
                      <p>
                        <strong>📈 Sentiment:</strong>{" "}
                        <span className={sentimentTextClasses[fb.sentiment]}>
                          {fb.sentiment}
                        </span>
                      </p>
                      <p><strong>🙋 User:</strong> {fb.username}</p>
                      <p className="text-sm text-gray-500">
                        ⏰ {new Date(fb.submittedAt).toLocaleString()}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((fb: any) => (
              <motion.div
                key={fb.id}
                className="bg-gradient-to-br from-green-100 via-white to-green-50 p-4 rounded-xl shadow-lg border-l-4 border-green-500"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <p><strong>📝 Content:</strong> {fb.content}</p>
                <p>
                  <strong>📈 Sentiment:</strong>{" "}
                  <span className={sentimentTextClasses[fb.sentiment]}>
                    {fb.sentiment}
                  </span>
                </p>
                <p><strong>🏢 Department:</strong> {fb.department}</p>
                <p className="text-sm text-gray-500">
                  ⏰ {new Date(fb.submittedAt).toLocaleString()}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
