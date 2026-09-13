"use client";

import { useState } from "react";
import Link from "next/link";
import { properties } from "./data/properties";

export default function Home() {
  const [lang, setLang] = useState<"ar" | "en">("ar");
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");

  const isAr = lang === "ar";

  const areas = ["all", ...Array.from(new Set(properties.map((p) => p.area_ar)))];
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
    const areaMatch = selectedArea === "all" || p.area_ar === selectedArea;
    const typeMatch = selectedType === "all" || p.type === selectedType;
    const genderMatch =
      selectedGender === "all" || p.gender === selectedGender || p.gender === "any";
    return areaMatch && typeMatch && genderMatch;
  });

  return (
    <main dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(isAr ? "en" : "ar")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700"
          >
            {isAr ? "English" : "العربية"}
          </button>
        </div>

        <h1 className="text-4xl font-bold text-center text-blue-600">
          {isAr ? "سكنات دبي" : "Dubai Rentals"}
        </h1>
        <p className="text-center text-gray-500 mt-2 mb-8">
          {isAr
            ? "سراير وبارتيشنات وغرف مفروشة - شامل كل الخدمات"
            : "Beds, partitions & rooms - All inclusive"}
        </p>

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">
              {isAr ? "المنطقة" : "Area"}
            </label>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a === "all" ? (isAr ? "كل المناطق" : "All Areas") : a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              {isAr ? "النوع" : "Type"}
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {types.map((t) => (
                <option key={t.value} value={t.value}>
                  {isAr ? t.ar : t.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">
              {isAr ? "الفئة" : "Gender"}
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full border rounded-lg p-2"
            >
              {genders.map((g) => (
                <option key={g.value} value={g.value}>
                  {isAr ? g.ar : g.en}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {isAr ? "عدد النتائج: " : "Results: "}
          {filtered.length}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <Link
              key={p.id}
              href={"/property/" + p.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition block"
            >
              <img
                src={p.image}
                alt={isAr ? p.title_ar : p.title_en}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex gap-2 mb-2">
                  <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {isAr ? p.type_ar : p.type_en}
                  </span>
                  <span className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full">
                    {isAr ? p.gender_ar : p.gender_en}
                  </span>
                </div>
                <h3 className="font-bold text-lg">
                  {isAr ? p.title_ar : p.title_en}
                </h3>
                <p className="text-sm text-gray-500">
                  {isAr ? p.area_ar : p.area_en}
                </p>
                <p className="text-xl font-semibold text-blue-600 mt-2">
                  {p.price_aed} AED {isAr ? "/ شهرياً" : "/ month"}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            {isAr ? "ما فيه نتائج بهذي الفلاتر" : "No results found"}
          </p>
        )}
      </div>
    </main>
  );
}