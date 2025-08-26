import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import TabBar from "../components/TabBar";

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
    <html lang="uz" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white`}
      >
        <div className="pb-20">{children}</div>
        <TabBar />
      </body>
    </html>
  );
}
