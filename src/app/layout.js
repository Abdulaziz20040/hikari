import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TabBar from "../components/TabBar"; // ✅ TabBar komponentini chaqiramiz

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Finance App",
  description: "Moliyaviy boshqaruv uchun Next.js ilovasi",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen`}
      >
        <div className="pb-20">{children}</div> {/* ✅ Sahifa kontenti */}
        <TabBar /> {/* ✅ Doimiy TabBar */}
      </body>
    </html>
  );
}
