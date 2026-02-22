import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/context/CartContext";
import Script from "next/script";

const lexend = Lexend({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "footfits.pk - Authentic Branded Shoes at Thrift Prices",
  description: "Pre-loved and brand new authentic branded shoes imported from USA/Europe. Nike, Adidas, New Balance, and more at unbeatable prices.",
};

import NextTopLoader from 'nextjs-toploader';
import { Toaster } from 'sonner';

import { GoogleAnalytics } from '@next/third-parties/google';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleAnalytics gaId="G-GPPHN8KXP4" />
      </head>
      <body className={lexend.className}>
        <NextTopLoader color="#284E3D" showSpinner={false} />
        <CartProvider>
          {children}
        </CartProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
