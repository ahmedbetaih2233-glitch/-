import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "الأماكن الفاخرة | Al Amakin Al Fakhira",
  description: "سكنات فاخرة للإيجار في دبي — سراير، بارتيشنات، غرف كاملة — شامل كل الخدمات",
  applicationName: "الأماكن الفاخرة",
  authors: [{ name: "Ahmed Betaih" }],
  keywords: ["سكنات دبي", "شقق للإيجار دبي", "سرير للإيجار", "بارتيشن دبي", "Dubai rentals"],
  openGraph: {
    title: "الأماكن الفاخرة | Al Amakin Al Fakhira",
    description: "سكنات فاخرة للإيجار في دبي — شامل كل الخدمات",
    siteName: "الأماكن الفاخرة",
    locale: "ar_AE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "الأماكن الفاخرة | Al Amakin Al Fakhira",
    description: "سكنات فاخرة للإيجار في دبي — شامل كل الخدمات",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
