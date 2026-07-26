import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BCS",
  description: "Production Equipment Rental System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="bg-gray-100">
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col">
            <header className="sticky top-0 z-50 border-b-2 border-[#00FF85] bg-black shadow-2xl">
              <div className="mx-auto flex h-32 w-full items-center justify-between px-8">

                {/* Logo + Company */}
                <div className="flex items-center gap-6">

                  <img
                    src="/logo.png"
                    alt="BCS Logo"
                    className="h-28 w-28 object-contain"
                  />

                  <div>
                    <h1 className="text-4xl font-extrabold tracking-wide text-[#00FF85] leading-none">
                      BIG CINE STUDIO
                    </h1>

                    <p className="mt-2 text-base uppercase tracking-[0.35em] text-gray-300">
                      FILM PRODUCTION EQUIPMENT
                    </p>
                  </div>

                </div>

                {/* Status */}
                <div className="hidden md:flex items-center gap-3 rounded-full border border-[#00FF85]/40 bg-zinc-900 px-6 py-3 shadow-lg">
                  <div className="h-3 w-3 rounded-full bg-[#00FF85] animate-pulse"></div>

                  <span className="text-base font-semibold text-white">
                    System Online
                  </span>
                </div>

              </div>
            </header>

            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}