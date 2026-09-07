import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

import "./globals.css";

const manrope = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "4HOME — меблі на замовлення у Києві",
    template: "%s | 4HOME",
  },
  description:
    "Меблі на замовлення у Києві та передмісті. Кухні, шафи та інші корпусні меблі за індивідуальними розмірами.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={manrope.variable}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}