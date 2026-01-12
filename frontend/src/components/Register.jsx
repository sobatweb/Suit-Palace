import React, { useState } from "react";
import { User, Lock, ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitRegister = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", { //ganti jadi lokasi backend
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Register gagal");
        return;
      }

      setSuccess("Admin berhasil dibuat");
      setUsername("");
      setPassword("");
      setShowConfirm(false);
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-6">
      {/* CARD */}
      <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-xl relative">
        {/* BACK */}
        <button
          onClick={() => navigate("/adminMaster")}
          className="mb-6 flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </button>

        <h2 className="text-2xl font-black mb-6 uppercase">
          Register Admin
        </h2>

        {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
        {success && <p className="text-emerald-600 text-xs mb-3">{success}</p>}

        {/* USERNAME */}
        <div className="mb-4">
          <label className="text-xs font-bold uppercase mb-1 block">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              className="w-full pl-10 pr-3 py-3 border rounded-xl"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin_user"
            />
          </div>
        </div>

        {/* PASSWORD */}
        <div className="mb-6">
          <label className="text-xs font-bold uppercase mb-1 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="password"
              className="w-full pl-10 pr-3 py-3 border rounded-xl"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
        </div>

        {/* SUBMIT */}
        <button
          onClick={() => setShowConfirm(true)}
          disabled={!username || !password}
          className="w-full bg-black text-white py-3 rounded-xl font-black uppercase text-xs tracking-widest disabled:opacity-40"
        >
          Create Admin
        </button>
      </div>

      {/* CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-sm p-6 rounded-2xl relative">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-black mb-4">
              Konfirmasi Pembuatan Admin
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Yakin ingin membuat admin baru dengan username:
              <br />
              <span className="font-bold">{username}</span> ?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border font-bold text-sm"
              >
                Batal
              </button>
              <button
                onClick={submitRegister}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-black text-white font-bold text-sm disabled:opacity-50"
              >
                {loading ? "Processing..." : "Ya, Buat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
