import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "St. Kizito's Technical Institute - Madera | SKTIM",
  description: "Building Skills, Transforming Lives Since 1947. Quality technical and vocational education programs in Uganda.",
  keywords: ["technical institute", "vocational training", "Madera", "TVET", "Uganda", "Soroti", "automotive", "electrical", "welding", "building construction", "fashion design", "SchoolPay"],
  authors: [{ name: "St. Kizito's Technical Institute - Madera" }],
  openGraph: {
    title: "St. Kizito's Technical Institute - Madera",
    description: "Building Skills, Transforming Lives Since 1947",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
