// src/pages/Login.jsx
import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-slate-900 p-8 rounded-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-800 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-4 rounded bg-slate-800 text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-violet-600 p-3 rounded text-white">
          Login
        </button>
      </form>
    </div>
  );
}