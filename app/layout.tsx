import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "footfits.pk - Authentic Branded Shoes at Thrift Prices",
  description: "Pre-loved and brand new authentic branded shoes imported from USA/Europe. Nike, Adidas, New Balance, and more at unbeatable prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={lexend.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
