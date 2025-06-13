import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ProtectedComponent from "@/components/constants/layout/ProtectedComponent";
import { Providers } from "@/api-service/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ashara 1447H Madras - Payments Reports",
  description: "Crafted with 💖 by HR Team Madras for Ashara 1447H",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <ProtectedComponent>{children}</ProtectedComponent>
        </Providers>
      </body>
    </html>
  );
}
