import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "الأماكن الفاخرة | Al Amakin Al Fakhira";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(212, 175, 55, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 90%, rgba(212, 175, 55, 0.1) 0%, transparent 40%)",
          padding: "60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "3px solid #d4af37",
            marginBottom: "40px",
          }}
        >
          <div style={{ fontSize: "70px", color: "#d4af37" }}>✦</div>
        </div>

        <div
          style={{
            fontSize: "80px",
            fontWeight: "900",
            background:
              "linear-gradient(135deg, #d4af37 0%, #f4d47a 50%, #d4af37 100%)",
            backgroundClip: "text",
            color: "transparent",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          الأماكن الفاخرة
        </div>

        <div
          style={{
            fontSize: "32px",
            color: "#a0a0a0",
            letterSpacing: "8px",
            marginBottom: "30px",
          }}
        >
          AL AMAKIN AL FAKHIRA
        </div>

        <div
          style={{
            fontSize: "34px",
            color: "#f5f5f5",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          سكنات فاخرة للإيجار في دبي
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#d4af37",
            marginTop: "20px",
          }}
        >
          سراير • بارتيشنات • غرف كاملة
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}