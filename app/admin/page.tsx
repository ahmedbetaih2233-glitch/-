"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword =
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Tote301124$";

    if (password === correctPassword) {
      localStorage.setItem("admin_auth", "true");
      router.push("/admin/dashboard");
    } else {
      setError("كلمة السر غلط");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-[#d4af37] mx-auto mb-4 flex items-center justify-center">
            <span className="text-[#d4af37] text-3xl font-bold">✦</span>
          </div>
          <h1 className="text-3xl font-black gold-gradient mb-2">
            الأماكن الفاخرة
          </h1>
          <p className="text-[#a0a0a0] text-sm">لوحة التحكم - تسجيل دخول</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-8 gold-glow"
        >
          <label className="block text-xs font-bold text-[#d4af37] mb-3 tracking-widest">
            كلمة السر
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full rounded-lg p-3 mb-4 text-center"
            autoFocus
          />

          {error && (
            <p className="text-red-400 text-sm text-center mb-4">⚠️ {error}</p>
          )}

          <button
            type="submit"
            className="btn-gold w-full py-3 rounded-xl font-black transition-all"
          >
            دخول
          </button>
        </form>

        <p className="text-center text-xs text-[#808080] mt-6">
          صفحة محمية - للمسؤول فقط
        </p>
      </div>
    </main>
  );
}