// src/pages/Register.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Local or hosted image URL
const imageUrl =
  "https://as2.ftcdn.net/v2/jpg/04/79/25/05/1000_F_479250512_WwEd5E6DLGyJ40SaCJaw2YXRWlKVng1U.jpg";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("User");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post("http://localhost:5271/api/User/register", {
        username,
        password,
        role,
      });

      if (res.status === 200) {
        setSuccessMsg("🎉 Registration successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err: any) {
      if (err.response?.status === 400) {
        setErrorMsg("⚠️ Username already exists. Try another one.");
      } else {
        setErrorMsg("❌ Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-slate-100 p-6">
      {/* Left Image Container */}
<div className="w-full max-w-xl bg-white/90 backdrop-blur-md p-18 rounded-xl shadow-2xl mb-6 md:mb-0 md:mr-12">
        <img
          src={imageUrl}
          alt="Welcome"
          className="w-full h-auto rounded-xl"
        />
      </div>

      {/* Right Form Container */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <h1 className="text-xl text-center text-gray-700 font-semibold mb-2">
          Welcome to Smart Feedback Portal
        </h1>

        <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
          📝 Register
        </h2>

        {errorMsg && (
          <p className="text-red-600 text-sm text-center mb-2">{errorMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 text-sm text-center mb-2">
            {successMsg}
          </p>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="User">🙋 User</option>
            <option value="Admin">🛠️ Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition"
          >
            ✅ Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
