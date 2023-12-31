import "swiper/css";
import "./global.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { UserDataProvider } from "@/context/UserDataContext";
import { ThemeProvider } from "@/components/ui/theme-provider";

const inter = Inter({ subsets: ["cyrillic-ext"] });

export const metadata: Metadata = {
  title: "Cyber Cinema",
  description: "Рекомендательная система для подбора фильмов",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen pt-20">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>

            <UserDataProvider>
              <Navbar />
              <div className={"sm:container mx-auto "}>
                <div className={"space-y-4 mb-4"}>{children}</div>
              </div>
            </UserDataProvider>
            
          </ThemeProvider>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
