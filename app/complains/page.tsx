"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

const issueTypes = [
  { value: "electricity", ar: "كهرباء" },
  { value: "plumbing", ar: "سباكة" },
  { value: "ac", ar: "تكييف" },
  { value: "cleanliness", ar: "نظافة" },
  { value: "noise", ar: "إزعاج" },
  { value: "furniture", ar: "أثاث" },
  { value: "internet", ar: "إنترنت" },
  { value: "other", ar: "أخرى" },
];

export default function ComplaintsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    apartment_number: "",
    issue_type: "electricity",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedType = issueTypes.find((t) => t.value === form.issue_type);

    const { error } = await supabase.from("complaints").insert({
      name: form.name,
      phone: form.phone,
      apartment_number: form.apartment_number,
      issue_type: form.issue_type,
      issue_type_ar: selectedType?.ar || form.issue_type,
      description: form.description,
      status: "new",
    });

    setLoading(false);

    if (error) {
      alert("خطأ: " + error.message);
    } else {
      setSuccess(true);
      setForm({
        name: "",
        phone: "",
        apartment_number: "",
        issue_type: "electricity",
        description: "",
      });
    }
  };

  return (
    <main dir="rtl" className="min-h-screen">
      <nav className="border-b border-[rgba(212,175,55,0.25)] bg-[#0a0a0a]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] flex items-center justify-center">
              <span className="text-[#d4af37] text-xl font-bold">✦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gold-gradient leading-tight">
                الأماكن الفاخرة
              </h1>
              <p className="text-[10px] text-[#a0a0a0] tracking-widest">
                AL AMAKIN AL FAKHIRA
              </p>
            </div>
          </Link>
          <Link
            href="/"
            className="border border-[#d4af37] text-[#d4af37] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#d4af37] hover:text-[#0a0a0a] transition"
          >
            ← رجوع
          </Link>
        </div>
      </nav>

      <section className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full border-2 border-[#d4af37] mx-auto mb-4 flex items-center justify-center">
            <span className="text-[#d4af37] text-3xl">📝</span>
          </div>
          <h1 className="text-3xl font-black gold-gradient mb-2">
            تقديم شكوى
          </h1>
          <p className="text-[#a0a0a0]">سنتواصل معك في أقرب وقت لحل المشكلة</p>
        </div>

        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-xl p-4 mb-6 text-center">
            <p className="text-green-400 font-bold">
              ✅ تم استلام شكوتك بنجاح
            </p>
            <p className="text-green-300 text-sm mt-1">
              سنتواصل معك قريباً عبر واتساب
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-8 gold-glow space-y-5"
        >
          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              الاسم الكامل *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="محمد أحمد"
              className="w-full rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              رقم الجوال *
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+971 50 123 4567"
              className="w-full rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              رقم الشقة *
            </label>
            <input
              type="text"
              value={form.apartment_number}
              onChange={(e) =>
                setForm({ ...form, apartment_number: e.target.value })
              }
              placeholder="مثال: 302 - بناية الختال"
              className="w-full rounded-lg p-3"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              نوع المشكلة *
            </label>
            <select
              value={form.issue_type}
              onChange={(e) => setForm({ ...form, issue_type: e.target.value })}
              className="w-full rounded-lg p-3"
              required
            >
              {issueTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.ar}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              تفاصيل المشكلة
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={4}
              placeholder="اشرح المشكلة بالتفصيل..."
              className="w-full rounded-lg p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full py-4 rounded-xl text-lg font-black transition-all disabled:opacity-50"
          >
            {loading ? "جاري الإرسال..." : "📤 إرسال الشكوى"}
          </button>
        </form>

        <p className="text-center text-xs text-[#808080] mt-6">
          أو تواصل معنا عبر{" "}
          <a
            href="https://wa.me/9715522297994"
            className="text-[#d4af37] hover:underline"
          >
            واتساب
          </a>
        </p>
      </section>
    </main>
  );
}

