import Link from "next/link";
import { notFound } from "next/navigation";
import { properties } from "../../data/properties";

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = properties.find((p) => p.id === Number(id));

  if (!property) return notFound();

  const phone = "971541610091";
  const whatsappMessage =
    "السلام عليكم، أريد أحجز: " + property.title_ar + " في " + property.area_ar;
  const whatsappLink =
    "https://wa.me/" + phone + "?text=" + encodeURIComponent(whatsappMessage);

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

      <section className="max-w-5xl mx-auto px-6 py-10">
        <div className="bg-[#141414] border border-[rgba(212,175,55,0.25)] rounded-2xl overflow-hidden gold-glow">
          <div className="relative">
            <img
              src={property.image}
              alt={property.title_ar}
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
            <div className="absolute top-6 right-6 flex gap-2">
              <span className="bg-[#d4af37] text-[#0a0a0a] text-xs px-3 py-1 rounded-full font-bold">
                {property.type_ar}
              </span>
              <span className="bg-[#0a0a0a] border border-[#d4af37] text-[#d4af37] text-xs px-3 py-1 rounded-full">
                {property.gender_ar}
              </span>
            </div>
          </div>

          <div className="p-8">
            <h1 className="text-4xl font-black text-white mb-2">
              {property.title_ar}
            </h1>
            <p className="text-[#a0a0a0] text-lg mb-1">📍 {property.area_ar}</p>
            <p className="text-sm text-[#808080] mb-6">{property.location_ar}</p>

            <div className="border-t border-b border-[rgba(212,175,55,0.2)] py-8 my-6 text-center">
              <p className="text-xs text-[#a0a0a0] mb-2 tracking-widest">
                السعر الشهري
              </p>
              <p className="text-6xl font-black gold-gradient">
                {property.price_aed}
                <span className="text-2xl mr-3">AED</span>
              </p>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold gold-gradient mb-3">الوصف</h2>
              <p className="text-[#d0d0d0] leading-relaxed text-lg">
                {property.description_ar}
              </p>
            </div>

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