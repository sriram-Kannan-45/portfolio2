import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.waveinitsolutions.online"),
  title: "Sriram K | AI & Software Builder | Founder, Wave Init Solutions",
  description:
    "Production-grade personal portfolio of Sriram K — AI & Data Science graduate, software builder, and founder of Wave Init Solutions. Specializing in computer vision, deep learning, enterprise platforms, and intelligent automation.",
  keywords: [
    "Sriram K",
    "Wave Init Solutions",
    "Wave Init LMS",
    "AI Builder",
    "Software Engineer",
    "Deep Learning",
    "Computer Vision",
    "YOLO Bone Fracture Detection",
    "Medicam AI",
  ],
  authors: [{ name: "Sriram K", url: "https://www.waveinitsolutions.online" }],
  creator: "Sriram K",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.waveinitsolutions.online",
    title: "Sriram K — AI & Software Builder | Founder, Wave Init Solutions",
    description:
      "Transforming artificial intelligence, deep learning, and robust software architecture into practical, scalable digital experiences.",
    siteName: "Sriram K Portfolio",
    images: [
      {
        url: "/sriram_portrait.jpg",
        width: 1024,
        height: 1024,
        alt: "Sriram K - Founder of Wave Init Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sriram K — AI & Software Builder | Founder, Wave Init Solutions",
    description:
      "Transforming artificial intelligence, deep learning, and robust software architecture into practical, scalable digital experiences.",
    images: ["/sriram_portrait.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/sriram_portrait.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark bg-[#050505] text-[#f3f4f6]`}
    >
      <body className="min-h-screen bg-[#050505] text-[#f3f4f6] font-sans antialiased selection:bg-[#16a34a]/30 selection:text-white relative">
        {children}
      </body>
    </html>
  );
}
