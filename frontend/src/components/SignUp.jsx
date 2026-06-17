// src/pages/Signup.jsx
import React, { useState } from "react";

export default function Signup() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#030712]">
      <form
        onSubmit={handleSubmit}
        className="w-[400px] bg-slate-900 p-8 rounded-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-6">
          Sign Up
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 mb-4 rounded bg-slate-800 text-white"
          onChange={(e) => setEmail(e.target.value)}
        />

        <button className="w-full bg-violet-600 p-3 rounded text-white">
          Send OTP
        </button>
      </form>
    </div>
  );
}