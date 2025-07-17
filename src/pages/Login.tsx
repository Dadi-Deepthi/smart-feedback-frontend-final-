// src/pages/Login.tsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const imageUrl = "https://hopefamilycentre.org/wp-content/uploads/2020/09/Feedback.jpg";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      const response = await axios.post("http://localhost:5271/api/User/login", {
        username,
        password,
      });

      console.log("✅ Login response:", response.data);

      const { token, role, username: name } = response.data;

      if (!token || !role || !name) {
        setErrorMsg("❌ Invalid response from server.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("username", name);

      navigate("/dashboard");
    } catch (error: any) {
      console.error("❌ Login error:", error);

      if (error.response?.status === 401) {
        setErrorMsg("⚠️ Invalid username or password.");
      } else {
        setErrorMsg("❌ Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-slate-100 p-6">
      {/* Left Image */}
      <div className="w-full max-w-xl bg-white/90 backdrop-blur-md p-6 rounded-xl shadow-2xl mb-6 md:mb-0 md:mr-12">
        <img src={imageUrl} alt="Login Illustration" className="w-full h-auto rounded-xl" />
      </div>

      {/* Right Form */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-xl shadow-2xl">
        <h1 className="text-xl text-center text-gray-700 font-semibold mb-2">
          Welcome to Smart Feedback Portal
        </h1>
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">🔐 Login</h2>

        {errorMsg && <p className="text-red-600 text-sm text-center mb-2">{errorMsg}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
          >
            ✅ Login
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <a href="/register" className="text-green-600 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
