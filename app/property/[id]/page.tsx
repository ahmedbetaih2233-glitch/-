"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabase";

type Property = {
  id: number;
  title_ar: string;
  title_en: string;
  area_id: number;
  type_ar: string;
  type_en: string;
  gender_ar: string;
  gender_en: string;
  price_aed: number;
  bathrooms: number;
  description_ar: string;
  description_en: string;
  location_ar: string;
  location_en: string;
  amenities_ar: string[];
  amenities_en: string[];
  images: string[];
};

type Area = {
  id: number;
  name_ar: string;
  name_en: string;
};

export default function PropertyPage() {
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    const { data: prop } = await supabase
      .from("properties")
      .select("*")
      .eq("id", Number(id))
      .single();

    if (prop) {
      setProperty(prop);
      const { data: areaData } = await supabase
        .from("areas")
        .select("*")
        .eq("id", prop.area_id)
        .single();
      setArea(areaData);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <main dir="rtl" className="min-h-screen flex items-center justify-center">
        <p className="text-[#d4af37] text-xl">جاري التحميل...</p>
      </main>
    );
  }

  if (!property) {
    return (
      <main dir="rtl" className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-[#d4af37] text-2xl font-bold">السكن غير موجود</p>
        <Link
          href="/"
          className="border border-[#d4af37] text-[#d4af37] px-6 py-3 rounded-full"
        >
          رجوع للرئيسية
        </Link>
      </main>
    );
  }

  const phone = "971541610091";
  const whatsappMessage =
    "السلام عليكم، أريد أحجز: " +
    property.title_ar +
    " في " +
    (area?.name_ar || "");
  const whatsappLink =
    "https://wa.me/" + phone + "?text=" + encodeURIComponent(whatsappMessage);

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"];

  return (
    <main dir="rtl" className="min-h-screen">
      {/* Navbar */}
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

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl overflow-hidden gold-glow">
          {/* الصورة الرئيسية */}
          <div className="relative">
            <img
              src={images[currentImage]}
              alt={property.title_ar}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent pointer-events-none" />

            <div className="absolute top-6 right-6 flex gap-2">
              <span className="bg-[#d4af37] text-[#0a0a0a] text-xs px-3 py-1 rounded-full font-bold">
                {property.type_ar}
              </span>
              <span className="bg-[#0a0a0a] border border-[#d4af37] text-[#d4af37] text-xs px-3 py-1 rounded-full">
                {property.gender_ar}
              </span>
            </div>

            {/* أسهم التنقل */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImage(
                      (currentImage - 1 + images.length) % images.length
                    )
                  }
                  className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 border border-[#d4af37] text-[#d4af37] text-2xl font-bold hover:bg-[#d4af37] hover:text-[#0a0a0a] transition"
                >
                  ›
                </button>
                <button
                  onClick={() =>
                    setCurrentImage((currentImage + 1) % images.length)
                  }
                  className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-black/70 border border-[#d4af37] text-[#d4af37] text-2xl font-bold hover:bg-[#d4af37] hover:text-[#0a0a0a] transition"
                >
                  ‹
                </button>

                {/* النقط */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i)}
                      className={
                        "w-2.5 h-2.5 rounded-full transition " +
                        (i === currentImage ? "bg-[#d4af37] w-6" : "bg-white/40")
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* الصور المصغرة */}
          {images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto border-b border-[rgba(212,175,55,0.15)]">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition " +
                    (i === currentImage
                      ? "border-[#d4af37]"
                      : "border-transparent opacity-60 hover:opacity-100")
                  }
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div className="p-8">
            <h1 className="text-4xl font-black text-white mb-2">
              {property.title_ar}
            </h1>
            <p className="text-[#a0a0a0] text-lg mb-1">
              📍 {area?.name_ar || ""}
            </p>
            <p className="text-sm text-[#808080] mb-6">{property.location_ar}</p>

            {/* السعر */}
            <div className="border-t border-b border-[rgba(212,175,55,0.2)] py-8 my-6 text-center">
              <p className="text-xs text-[#a0a0a0] mb-2 tracking-widest">
                السعر الشهري
              </p>
              <p className="text-6xl font-black gold-gradient">
                {property.price_aed}
                <span className="text-2xl mr-3">AED</span>
              </p>
            </div>

            {/* معلومات إضافية */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.25)] rounded-xl p-5 text-center">
                <p className="text-xs text-[#a0a0a0] mb-2">🚿 عدد الحمامات</p>
                <p className="text-3xl font-black text-[#d4af37]">
                  {property.bathrooms || 1}
                </p>
              </div>
              <div className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.25)] rounded-xl p-5 text-center">
                <p className="text-xs text-[#a0a0a0] mb-2">🏠 النوع</p>
                <p className="text-2xl font-black text-[#d4af37]">
                  {property.type_ar}
                </p>
              </div>
            </div>

            {/* الوصف */}
            {property.description_ar && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold gold-gradient mb-3">الوصف</h2>
                <p className="text-[#d0d0d0] leading-relaxed text-lg">
                  {property.description_ar}
                </p>
              </div>
            )}

            {/* الخدمات */}
            {property.amenities_ar && property.amenities_ar.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold gold-gradient mb-4">
                  الخدمات المشمولة
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities_ar.map((a, i) => (
                    <div
                      key={i}
                      className="bg-[#0a0a0a] border border-[rgba(212,175,55,0.25)] rounded-lg px-4 py-3 flex items-center gap-2"
                    >
                      <span className="text-[#d4af37]">✓</span>
                      <span className="text-[#f5f5f5] text-sm">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* زر الحجز */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold block text-center py-4 rounded-xl text-lg font-black transition-all"
            >
              📱 احجز الآن عبر واتساب
            </a>

            <p className="text-center text-xs text-[#808080] mt-4">
              سيتم التواصل معك خلال دقائق لتأكيد الحجز
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}