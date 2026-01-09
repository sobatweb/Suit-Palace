import React from "react";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

const LogoutConfirmModal = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
      >
        <div className="text-center space-y-4">
          <LogOut className="mx-auto text-gray-500" size={36} />
          <h3 className="text-lg font-black uppercase tracking-tight">
            Konfirmasi Logout
          </h3>
          <p className="text-xs text-gray-500">
            Apakah Anda yakin ingin keluar dari admin dashboard?
          </p>
        </div>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#1A120B] text-white rounded-xl text-[10px] font-black uppercase tracking-widest"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LogoutConfirmModal;
