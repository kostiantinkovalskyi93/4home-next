import type { Metadata } from "next";

import { Footer } from "@/components/layout/Footer";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "4HOME — меблі на замовлення у Києві",
    template: "%s | 4HOME",
  },
  description:
    "Індивідуальні корпусні меблі на замовлення у Києві: кухні, шафи, тумби та інші меблі за вашими розмірами.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}