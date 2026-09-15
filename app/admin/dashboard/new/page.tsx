"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabase";

type Area = {
  id: number;
  name_ar: string;
  name_en: string;
};

export default function NewProperty() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);

  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    area_id: "",
    type: "single_bed",
    type_ar: "سرير سنجل",
    type_en: "Single Bed",
    gender: "men",
    gender_ar: "شباب",
    gender_en: "Men",
    price_aed: "",
    bathrooms: "1",
    description_ar: "",
    description_en: "",
    location_ar: "",
    location_en: "",
    amenities_ar: [] as string[],
    amenities_en: [] as string[],
    images: [] as string[],
    map_url: "",
  });

  const allAmenities = [
    { ar: "واي فاي", en: "WiFi" },
    { ar: "كهرباء وماء", en: "Utilities" },
    { ar: "تنظيف", en: "Cleaning" },
    { ar: "غسالة", en: "Washing Machine" },
    { ar: "مطبخ", en: "Kitchen" },
    { ar: "غاز", en: "Gas" },
    { ar: "تكييف مركزي", en: "Central AC" },
    { ar: "بلكونة", en: "Balcony" },
    { ar: "موقف سيارة", en: "Parking" },
    { ar: "أمن", en: "Security" },
  ];

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/admin");
      return;
    }
    loadAreas();
  }, [router]);

  const loadAreas = async () => {
    const { data } = await supabase.from("areas").select("*").order("id");
    setAreas(data || []);
  };

  const handleTypeChange = (value: string) => {
    const types: Record<string, { ar: string; en: string }> = {
      single_bed: { ar: "سرير سنجل", en: "Single Bed" },
      double_bed: { ar: "سرير دبل", en: "Double Bed" },
      partition: { ar: "بارتيشن", en: "Partition" },
      full_room: { ar: "غرفة كاملة", en: "Full Room" },
    };
    setForm({
      ...form,
      type: value,
      type_ar: types[value].ar,
      type_en: types[value].en,
    });
  };

  const handleGenderChange = (value: string) => {
    const genders: Record<string, { ar: string; en: string }> = {
      men: { ar: "شباب", en: "Men" },
      women: { ar: "بنات", en: "Women" },
      any: { ar: "شباب وبنات", en: "Men & Women" },
    };
    setForm({
      ...form,
      gender: value,
      gender_ar: genders[value].ar,
      gender_en: genders[value].en,
    });
  };

  const toggleAmenity = (ar: string, en: string) => {
    const hasAr = form.amenities_ar.includes(ar);
    if (hasAr) {
      setForm({
        ...form,
        amenities_ar: form.amenities_ar.filter((a) => a !== ar),
        amenities_en: form.amenities_en.filter((a) => a !== en),
      });
    } else {
      setForm({
        ...form,
        amenities_ar: [...form.amenities_ar, ar],
        amenities_en: [...form.amenities_en, en],
      });
    }
  };

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const scale = Math.min(1, MAX_WIDTH / img.width);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => (blob ? resolve(blob) : reject("Compression failed")),
            "image/jpeg",
            0.75
          );
        };
      };
      reader.onerror = reject;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const compressed = await compressImage(file);
        const fileName =
          Date.now() +
          "-" +
          i +
          "-" +
          Math.random().toString(36).substring(7) +
          ".jpg";

        const { error } = await supabase.storage
          .from("property-images")
          .upload(fileName, compressed);

        if (error) {
          alert("خطأ في رفع الصورة: " + error.message);
          continue;
        }

        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);

        newImages.push(urlData.publicUrl);
      } catch (err) {
        console.error(err);
      }
    }

    setForm({ ...form, images: [...form.images, ...newImages] });
    setUploading(false);
  };

  const removeImage = (url: string) => {
    setForm({ ...form, images: form.images.filter((img) => img !== url) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!form.title_ar || !form.price_aed || !form.area_id) {
      alert("املأ الحقول المطلوبة");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("properties").insert({
      title_ar: form.title_ar,
      title_en: form.title_en || form.title_ar,
      area_id: Number(form.area_id),
      type: form.type,
      type_ar: form.type_ar,
      type_en: form.type_en,
      gender: form.gender,
      gender_ar: form.gender_ar,
      gender_en: form.gender_en,
      price_aed: Number(form.price_aed),
      bathrooms: Number(form.bathrooms),
      description_ar: form.description_ar,
      description_en: form.description_en,
      location_ar: form.location_ar,
      location_en: form.location_en,
      amenities_ar: form.amenities_ar,
      amenities_en: form.amenities_en,
      images: form.images,
      map_url: form.map_url,
      is_active: true,
    });

    if (error) {
      alert("خطأ: " + error.message);
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <main dir="rtl" className="min-h-screen">
      <nav className="border-b border-[rgba(212,175,55,0.25)] bg-[#0a0a0a]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/admin/dashboard" className="text-[#d4af37] text-sm">
            ← رجوع للوحة
          </Link>
          <h1 className="text-lg font-bold gold-gradient">إضافة سكن جديد</h1>
          <div className="w-20" />
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6">
            <h2 className="text-lg font-bold gold-gradient mb-4">العنوان</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  العنوان بالعربي *
                </label>
                <input
                  type="text"
                  value={form.title_ar}
                  onChange={(e) =>
                    setForm({ ...form, title_ar: e.target.value })
                  }
                  placeholder="سرير سنجل - أبو هيل"
                  className="w-full rounded-lg p-3"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  العنوان بالإنجليزي
                </label>
                <input
                  type="text"
                  value={form.title_en}
                  onChange={(e) =>
                    setForm({ ...form, title_en: e.target.value })
                  }
                  placeholder="Single Bed - Abu Hail"
                  className="w-full rounded-lg p-3"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6">
            <h2 className="text-lg font-bold gold-gradient mb-4">التفاصيل</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  المنطقة *
                </label>
                <select
                  value={form.area_id}
                  onChange={(e) =>
                    setForm({ ...form, area_id: e.target.value })
                  }
                  className="w-full rounded-lg p-3"
                  required
                >
                  <option value="">اختر المنطقة</option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name_ar}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  النوع *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full rounded-lg p-3"
                >
                  <option value="single_bed">سرير سنجل</option>
                  <option value="double_bed">سرير دبل</option>
                  <option value="partition">بارتيشن</option>
                  <option value="full_room">غرفة كاملة</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  الفئة *
                </label>
                <select
                  value={form.gender}
                  onChange={(e) => handleGenderChange(e.target.value)}
                  className="w-full rounded-lg p-3"
                >
                  <option value="men">شباب</option>
                  <option value="women">بنات</option>
                  <option value="any">شباب وبنات</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  السعر (AED) *
                </label>
                <input
                  type="number"
                  value={form.price_aed}
                  onChange={(e) =>
                    setForm({ ...form, price_aed: e.target.value })
                  }
                  placeholder="1600"
                  className="w-full rounded-lg p-3"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  عدد الحمامات *
                </label>
                <select
                  value={form.bathrooms}
                  onChange={(e) =>
                    setForm({ ...form, bathrooms: e.target.value })
                  }
                  className="w-full rounded-lg p-3"
                  required
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5 أو أكثر</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6">
            <h2 className="text-lg font-bold gold-gradient mb-4">الوصف والموقع</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  الوصف بالعربي
                </label>
                <textarea
                  value={form.description_ar}
                  onChange={(e) =>
                    setForm({ ...form, description_ar: e.target.value })
                  }
                  rows={3}
                  className="w-full rounded-lg p-3"
                  placeholder="بارتيشن في بناية الختال..."
                />
              </div>
              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  الموقع بالعربي
                </label>
                <input
                  type="text"
                  value={form.location_ar}
                  onChange={(e) =>
                    setForm({ ...form, location_ar: e.target.value })
                  }
                  className="w-full rounded-lg p-3"
                  placeholder="بناية الختال - بجوار حديقة أبو هيل"
                />
              </div>
              <div>
                <label className="block text-xs text-[#d4af37] mb-2">
                  📍 رابط الموقع على Google Maps
                </label>
                <input
                  type="url"
                  value={form.map_url}
                  onChange={(e) =>
                    setForm({ ...form, map_url: e.target.value })
                  }
                  placeholder="https://maps.app.goo.gl/..."
                  className="w-full rounded-lg p-3"
                  dir="ltr"
                />
                <p className="text-xs text-[#808080] mt-2">
                  اذهب لـ Google Maps → ابحث عن المكان → Share → Copy link → الصق هنا
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6">
            <h2 className="text-lg font-bold gold-gradient mb-4">
              الخدمات المشمولة
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allAmenities.map((a) => (
                <button
                  key={a.ar}
                  type="button"
                  onClick={() => toggleAmenity(a.ar, a.en)}
                  className={
                    "text-right px-4 py-3 rounded-lg border transition " +
                    (form.amenities_ar.includes(a.ar)
                      ? "bg-[#d4af37] text-[#0a0a0a] border-[#d4af37] font-bold"
                      : "border-[rgba(212,175,55,0.3)] text-[#d4af37] hover:bg-[rgba(212,175,55,0.1)]")
                  }
                >
                  {form.amenities_ar.includes(a.ar) ? "✓ " : ""}
                  {a.ar}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl p-6">
            <h2 className="text-lg font-bold gold-gradient mb-4">
              الصور ({form.images.length})
            </h2>

            <label className="block cursor-pointer">
              <div className="border-2 border-dashed border-[rgba(212,175,55,0.4)] rounded-xl p-8 text-center hover:border-[#d4af37] transition">
                <p className="text-[#d4af37] text-lg mb-2">
                  {uploading ? "⏳ جاري الرفع..." : "📷 اضغط لاختيار الصور"}
                </p>
                <p className="text-xs text-[#808080]">
                  يمكنك اختيار أكثر من صورة معاً
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {form.images.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mt-4">
                {form.images.map((url, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={url}
                      className="w-full h-24 object-cover rounded-lg border border-[rgba(212,175,55,0.3)]"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(url)}
                      className="absolute top-1 left-1 bg-red-500 text-white w-6 h-6 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="btn-gold w-full py-4 rounded-xl text-lg font-black transition-all disabled:opacity-50"
          >
            {loading ? "جاري الحفظ..." : "💾 حفظ السكن"}
          </button>
        </form>
      </section>
    </main>
  );
}