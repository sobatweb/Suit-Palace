import React, { useState } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";

const RegisterAdminModal = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Register gagal");
        return;
      }

      setSuccess("Admin berhasil dibuat");
      setUsername("");
      setPassword("");
    } catch {
      setError("Server error");
    }
  };

  return (
    <div className="fixed inset-0 z-200 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 rounded-3xl relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X />
        </button>

        <h2 className="text-xl font-black uppercase mb-6">
          Register Admin
        </h2>

        {error && (
          <div className="flex items-center gap-2 p-4 mb-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600">
            <AlertCircle size={16} />
            <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
          </div>
        )}
        {success && (
          <div className="flex items-center gap-2 p-4 mb-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600">
            <CheckCircle size={16} />
            <p className="text-[10px] font-black uppercase tracking-widest">{success}</p>
          </div>
        )}

        <input
          placeholder="Username"
          className="w-full mb-3 p-3 border rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 p-3 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-black text-white py-3 rounded font-bold"
        >
          Create Admin
        </button>
      </div>
    </div>
  );
};

export default RegisterAdminModal;
