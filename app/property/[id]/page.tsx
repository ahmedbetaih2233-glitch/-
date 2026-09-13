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
  const whatsappMessage = "السلام عليكم، أريد أحجز: " + property.title_ar + " في " + property.area_ar;
  const whatsappLink = "https://wa.me/" + phone + "?text=" + encodeURIComponent(whatsappMessage);

  return (
    <main dir="rtl" className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-blue-600 hover:underline mb-4 inline-block">
          رجوع للرئيسية
        </Link>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <img
            src={property.image}
            alt={property.title_ar}
            className="w-full h-80 object-cover"
          />

          <div className="p-6">
            <div className="flex gap-2 mb-3">
              <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                {property.type_ar}
              </span>
              <span className="inline-block bg-pink-100 text-pink-700 text-xs px-3 py-1 rounded-full">
                {property.gender_ar}
              </span>
            </div>

            <h1 className="text-3xl font-bold">{property.title_ar}</h1>
            <p className="text-gray-500 mt-1">{property.area_ar}</p>
            <p className="text-sm text-gray-400 mt-1">{property.location_ar}</p>

            <p className="text-3xl font-bold text-blue-600 mt-4">
              {property.price_aed} AED / شهرياً
            </p>

            <div className="mt-6">
              <h2 className="font-bold text-lg mb-2">الوصف</h2>
              <p className="text-gray-700 leading-relaxed">
                {property.description_ar}
              </p>
            </div>

            <div className="mt-6">
              <h2 className="font-bold text-lg mb-2">الخدمات المشمولة</h2>
              <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {property.amenities_ar.map((a, i) => (
                  <li key={i} className="text-gray-700">
                    {a}
                  </li>
                ))}
              </ul>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 block text-center bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition"
            >
              احجز الآن عبر واتساب
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}