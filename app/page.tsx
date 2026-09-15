"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "./lib/supabase";

type Property = {
  id: number;
  title_ar: string;
  title_en: string;
  area_id: number;
  type: string;
  type_ar: string;
  type_en: string;
  gender: string;
  gender_ar: string;
  gender_en: string;
  price_aed: number;
  images: string[];
  is_active: boolean;
};

type Area = {
  id: number;
  name_ar: string;
  name_en: string;
};

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [properties, setProperties] = useState<Property[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);

  const isAr = lang === "ar";

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [propsRes, areasRes] = await Promise.all([
      supabase
        .from("properties")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false }),
      supabase.from("areas").select("*").order("id"),
    ]);

    setProperties(propsRes.data || []);
    setAreas(areasRes.data || []);
    setLoading(false);
  };

  const getAreaName = (areaId: number) => {
    const area = areas.find((a) => a.id === areaId);
    if (!area) return "";
    return isAr ? area.name_ar : area.name_en;
  };

  const types = [
    { value: "all", ar: "الكل", en: "All" },
    { value: "single_bed", ar: "سرير سنجل", en: "Single Bed" },
    { value: "double_bed", ar: "سرير دبل", en: "Double Bed" },
    { value: "partition", ar: "بارتيشن", en: "Partition" },
    { value: "full_room", ar: "غرفة كاملة", en: "Full Room" },
  ];
  const genders = [
    { value: "all", ar: "الكل", en: "All" },
    { value: "men", ar: "شباب", en: "Men" },
    { value: "women", ar: "بنات", en: "Women" },
  ];

  const filtered = properties.filter((p) => {
    const areaMatch =
      selectedArea === "all" || p.area_id === Number(selectedArea);
    const typeMatch = selectedType === "all" || p.type === selectedType;
    const genderMatch =
      selectedGender === "all" ||
      p.gender === selectedGender ||
      p.gender === "any";
    return areaMatch && typeMatch && genderMatch;
  });

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen">
      {/* ===== Navbar ===== */}
      <nav className="border-b border-[rgba(212,175,55,0.25)] bg-[#0a0a0a]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#d4af37] flex items-center justify-center">
              <span className="text-[#d4af37] text-xl font-bold">✦</span>
            </div>
            <div>
              <h1 className="text-xl font-bold gold-gradient leading-tight">
                {isAr ? "الأماكن الفاخرة" : "Al Amakin Al Fakhira"}
              </h1>
              <p className="text-[10px] text-[#a0a0a0] tracking-widest">
                {isAr ? "AL AMAKIN AL FAKHIRA" : "الأماكن الفاخرة"}
              </p>
            </div>
          </Link>

          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="border border-[#d4af37] text-[#d4af37] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#d4af37] hover:text-[#0a0a0a] transition"
          >
            {isAr ? "English" : "العربية"}
          </button>
        </div>
      </nav>

      {/* ===== Hero ===== */}
      <section className="relative py-20 px-6 text-center border-b border-[rgba(212,175,55,0.15)]">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block px-4 py-1 rounded-full border border-[rgba(212,175,55,0.4)] text-[#d4af37] text-xs mb-6 tracking-wider">
            {isAr ? "★ إقامة فاخرة في قلب دبي ★" : "★ Luxury Living in Dubai ★"}
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            <span className="gold-gradient">
              {isAr ? "سكنك الفاخر في دبي" : "Your Luxury Home in Dubai"}
            </span>
          </h2>
          <p className="text-[#a0a0a0] text-lg max-w-2xl mx-auto">
            {isAr
              ? "سراير، بارتيشنات، وغرف كاملة — شامل كل الخدمات في أفضل مناطق دبي"
              : "Beds, partitions & full rooms — All inclusive in Dubai's best areas"}
          </p>
        </div>
      </section>

      {/* ===== Filters ===== */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-4 gold-glow">
          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              {isAr ? "المنطقة" : "AREA"}
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full rounded-lg p-3"
            >
              <option value="all">
                {isAr ? "كل المناطق" : "All Areas"}
              </option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>
                  {isAr ? a.name_ar : a.name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              {isAr ? "النوع" : "TYPE"}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-lg p-3"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {isAr ? t.ar : t.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#d4af37] mb-2 tracking-wider">
              {isAr ? "الفئة" : "GENDER"}
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full rounded-lg p-3"
            >
              {genders.map((g) => (
                <option key={g.value} value={g.value}>
                  {isAr ? g.ar : g.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-[#a0a0a0] mt-6 mb-4">
          {isAr ? "عدد النتائج: " : "Results: "}
          <span className="text-[#d4af37] font-bold">{filtered.length}</span>
        </p>

        {loading && (
          <p className="text-center text-[#a0a0a0] py-16">جاري التحميل...</p>
        )}

        {!loading && filtered.length === 0 && (
          <p className="text-center text-[#a0a0a0] py-16 text-lg">
            {isAr ? "لا توجد نتائج مطابقة" : "No results found"}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <Link
                key={p.id}
                href={"/property/" + p.id}
                className="group bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl overflow-hidden hover:border-[#d4af37] transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:-translate-y-1"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      p.images && p.images.length > 0
                        ? p.images[0]
                        : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"
                    }
                    alt={isAr ? p.title_ar : p.title_en}
                    className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="bg-[#d4af37] text-[#0a0a0a] text-xs px-3 py-1 rounded-full font-bold">
                      {isAr ? p.type_ar : p.type_en}
                    </span>
                    <span className="border border-[#d4af37] text-[#d4af37] text-xs px-3 py-1 rounded-full">
                      {isAr ? p.gender_ar : p.gender_en}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-1">
                    {isAr ? p.title_ar : p.title_en}
                  </h3>
                  <p className="text-sm text-[#a0a0a0] mb-4">
                    📍 {getAreaName(p.area_id)}
                  </p>

                  <div className="flex items-end justify-between border-t border-[rgba(212,175,55,0.15)] pt-3">
                    <div>
                      <p className="text-xs text-[#a0a0a0]">
                        {isAr ? "شهرياً" : "/ month"}
                      </p>
                      <p className="text-2xl font-black gold-gradient">
                        {p.price_aed} <span className="text-sm">AED</span>
                      </p>
                    </div>
                    <span className="text-[#d4af37] group-hover:translate-x-[-5px] transition-transform">
                      ←
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== خدماتنا ===== */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-[rgba(212,175,55,0.15)]">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 rounded-full border border-[rgba(212,175,55,0.4)] text-[#d4af37] text-xs mb-4 tracking-wider">
            {isAr ? "★ خدمات حصرية ★" : "★ Exclusive Services ★"}
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-3">
            <span className="gold-gradient">
              {isAr ? "خدماتنا" : "Our Services"}
            </span>
          </h2>
          <p className="text-[#a0a0a0] max-w-2xl mx-auto">
            {isAr
              ? "خدمات متكاملة لراحتك — من الشكاوي للصيانة للأكل والتوصيل"
              : "Complete services for your comfort — from complaints to maintenance, meals & delivery"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* الشكاوي */}
          <Link
            href="/complaints"
            className="group bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6 hover:border-[#d4af37] transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:-translate-y-1"
          >
            <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4 group-hover:bg-[#d4af37] transition">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isAr ? "تقديم شكوى" : "Submit Complaint"}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed mb-4">
              {isAr
                ? "قدّم شكوتك (كهرباء، سباكة، تكييف، نظافة...) وسنتواصل معك فوراً"
                : "Submit your complaint (electricity, plumbing, AC, cleanliness...)"}
            </p>
            <span className="text-[#d4af37] text-sm font-bold inline-block transition group-hover:translate-x-[-5px]">
              {isAr ? "اذهب الآن ←" : "Go now →"}
            </span>
          </Link>

          {/* اشتراك الأكل */}
          <div className="group bg-[#141414] border border-[rgba(212,175,55,0.15)] rounded-2xl p-6 relative opacity-60">
            <div className="absolute top-4 left-4 bg-[#d4af37] text-[#0a0a0a] text-xs px-2 py-1 rounded-full font-bold">
              {isAr ? "قريباً" : "Soon"}
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4">
              <span className="text-3xl">🍽️</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isAr ? "اشتراك أكل شهري" : "Monthly Meal Plan"}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              {isAr
                ? "باقات شهرية: 10، 20، أو 30 وجبة — توصيل مجاني"
                : "Monthly plans: 10, 20, or 30 meals — free delivery"}
            </p>
          </div>

          {/* التوصيل */}
          <div className="group bg-[#141414] border border-[rgba(212,175,55,0.15)] rounded-2xl p-6 relative opacity-60">
            <div className="absolute top-4 left-4 bg-[#d4af37] text-[#0a0a0a] text-xs px-2 py-1 rounded-full font-bold">
              {isAr ? "قريباً" : "Soon"}
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4">
              <span className="text-3xl">🚚</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isAr ? "خدمة توصيل" : "Delivery Service"}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              {isAr
                ? "توصيل البقالة، الصيدلية، وأي احتياجات — بسرعة وأمان"
                : "Groceries, pharmacy, and anything you need"}
            </p>
          </div>

          {/* الصيانة */}
          <div className="group bg-[#141414] border border-[rgba(212,175,55,0.15)] rounded-2xl p-6 relative opacity-60">
            <div className="absolute top-4 left-4 bg-[#d4af37] text-[#0a0a0a] text-xs px-2 py-1 rounded-full font-bold">
              {isAr ? "قريباً" : "Soon"}
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4">
              <span className="text-3xl">🔧</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isAr ? "صيانة" : "Maintenance"}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              {isAr
                ? "كهربائي، سباك، فني تكييف — خدمة 24/7"
                : "Electrician, plumber, AC technician — 24/7"}
            </p>
          </div>

          {/* التنظيف */}
          <div className="group bg-[#141414] border border-[rgba(212,175,55,0.15)] rounded-2xl p-6 relative opacity-60">
            <div className="absolute top-4 left-4 bg-[#d4af37] text-[#0a0a0a] text-xs px-2 py-1 rounded-full font-bold">
              {isAr ? "قريباً" : "Soon"}
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4">
              <span className="text-3xl">🧹</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isAr ? "تنظيف عميق" : "Deep Cleaning"}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              {isAr
                ? "تنظيف شامل للشقة أو الغرفة — بمواد آمنة"
                : "Complete apartment or room cleaning"}
            </p>
          </div>

          {/* خدمات أخرى */}
          <div className="group bg-[#141414] border border-[rgba(212,175,55,0.15)] rounded-2xl p-6 relative opacity-60">
            <div className="absolute top-4 left-4 bg-[#d4af37] text-[#0a0a0a] text-xs px-2 py-1 rounded-full font-bold">
              {isAr ? "قريباً" : "Soon"}
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-[#d4af37] flex items-center justify-center mb-4">
              <span className="text-3xl">📦</span>
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              {isAr ? "خدمات أخرى" : "Other Services"}
            </h3>
            <p className="text-sm text-[#a0a0a0] leading-relaxed">
              {isAr
                ? "خدمات إضافية حسب الطلب — تواصل معنا"
                : "Additional services on request"}
            </p>
          </div>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[rgba(212,175,55,0.2)] py-10 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#d4af37] mx-auto mb-4 flex items-center justify-center">
            <span className="text-[#d4af37] text-2xl">✦</span>
          </div>
          <h3 className="text-xl font-bold gold-gradient mb-2">
            {isAr ? "الأماكن الفاخرة" : "Al Amakin Al Fakhira"}
          </h3>
          <p className="text-sm text-[#a0a0a0] mb-6">
            {isAr ? "إقامة فاخرة في قلب دبي" : "Luxury living in Dubai"}
          </p>
          <div className="flex justify-center gap-6 text-sm text-[#a0a0a0] mb-8">
            <a
              href="https://wa.me/971541610091"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d4af37] transition"
            >
              واتساب
            </a>
            <span className="text-[rgba(212,175,55,0.3)]">|</span>
            <span>© 2026</span>
          </div>

          {/* توقيع المطور */}
          <div className="border-t border-[rgba(212,175,55,0.15)] pt-6 max-w-md mx-auto">
            <p className="text-xs text-[#808080] mb-3 tracking-widest">
              ◆ DEVELOPMENT ◆
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <span className="text-xs text-[#a0a0a0]">
                {isAr ? "تم تنفيذ الموقع بواسطة" : "Website developed by"}
              </span>
              <span className="text-sm font-black gold-gradient">
                {isAr ? "أحمد بطيح" : "Ahmed Betaih"}
              </span>
            </div>
            <a
              href="https://wa.me/971541610091"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full border border-[rgba(212,175,55,0.4)] text-[#d4af37] text-xs font-bold hover:bg-[#d4af37] hover:text-[#0a0a0a] transition-all group"
            >
              <span>📱</span>
              <span className="tracking-wider">+971 54 161 0091</span>
              <span className="text-[10px] opacity-70 group-hover:opacity-100">
                {isAr ? "لطلب موقع مشابه" : "For a similar website"}
              </span>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}