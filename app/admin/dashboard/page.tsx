"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Property = {
  id: number;
  title_ar: string;
  title_en: string;
  type_ar: string;
  gender_ar: string;
  price_aed: number;
  is_active: boolean;
};

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin");
      return;
    }
    loadProperties();
  }, [router]);

  const loadProperties = async () => {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setProperties(data || []);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("متأكد إنك عايز تحذف السكن ده؟")) return;

    const { error } = await supabase.from("properties").delete().eq("id", id);

    if (!error) {
      setProperties(properties.filter((p) => p.id !== id));
    } else {
      alert("حصل خطأ: " + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    router.push("/admin");
  };

  return (
    <main dir="rtl" className="min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-[rgba(212,175,55,0.25)] bg-[#0a0a0a]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] flex items-center justify-center">
              <span className="text-[#d4af37] text-xl font-bold">✦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gold-gradient leading-tight">
                لوحة التحكم
              </h1>
              <p className="text-[10px] text-[#a0a0a0] tracking-widest">
                ADMIN DASHBOARD
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/"
              className="border border-[#d4af37] text-[#d4af37] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#d4af37] hover:text-[#0a0a0a] transition"
            >
              الموقع
            </Link>
            <button
              onClick={handleLogout}
              className="border border-red-500/50 text-red-400 px-4 py-2 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition"
            >
              خروج
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-black gold-gradient mb-1">
              السكنات
            </h2>
            <p className="text-sm text-[#a0a0a0]">
              إجمالي: {properties.length}
            </p>
          </div>

          <Link
            href="/admin/dashboard/new"
            className="btn-gold px-6 py-3 rounded-xl font-black transition-all"
          >
            + إضافة سكن جديد
          </Link>
        </div>

        {/* Loading */}
        {loading && (
          <p className="text-center text-[#a0a0a0] py-16">جاري التحميل...</p>
        )}

        {/* Empty */}
        {!loading && properties.length === 0 && (
          <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-16 text-center">
            <p className="text-[#a0a0a0] text-lg mb-4">
              ما فيه سكنات حتى الآن
            </p>
            <Link
              href="/admin/dashboard/new"
              className="btn-gold inline-block px-6 py-3 rounded-xl font-black"
            >
              + أضف أول سكن
            </Link>
          </div>
        )}

        {/* Properties List */}
        {!loading && properties.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((p) => (
              <div
                key={p.id}
                className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-xl p-4"
              >
                <div className="flex gap-2 mb-3">
                  <span className="bg-[#d4af37] text-[#0a0a0a] text-xs px-2 py-1 rounded-full font-bold">
                    {p.type_ar}
                  </span>
                  <span className="border border-[#d4af37] text-[#d4af37] text-xs px-2 py-1 rounded-full">
                    {p.gender_ar}
                  </span>
                </div>

                <h3 className="font-bold text-white mb-1">{p.title_ar}</h3>
                <p className="text-2xl font-black gold-gradient mb-4">
                  {p.price_aed} <span className="text-sm">AED</span>
                </p>

                <div className="flex gap-2">
                  <Link
                    href={"/admin/dashboard/edit/" + p.id}
                    className="flex-1 text-center border border-[#d4af37] text-[#d4af37] py-2 rounded-lg text-sm font-bold hover:bg-[#d4af37] hover:text-[#0a0a0a] transition"
                  >
                    تعديل
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 border border-red-500/50 text-red-400 py-2 rounded-lg text-sm font-bold hover:bg-red-500 hover:text-white transition"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}