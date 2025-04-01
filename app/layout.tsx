import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import localFont from "next/font/local";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const morgana = localFont({
  src: "../public/font/Morgana.otf",
  variable: "--font-morgana",
});

export const metadata: Metadata = {
  title: "Maria Rose Photography | Metro Detroit Lifestyle Photographer",
  description:
    "Professional natural light and lifestyle photography services in Metro Detroit. Specializing in portraits, families, and special events. Book your session today.",
  metadataBase: new URL("https://mariarosephotography.com"),
  keywords: [
    "detroit photographer",
    "lifestyle photography",
    "natural light",
    "family portraits",
    "metro detroit",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Maria Rose Photography | Natural Light & Lifestyle Photography",
    description:
      "Capturing life's beautiful moments with a natural, candid approach. Metro Detroit's premier lifestyle photographer.",
    url: "https://mariarosephotography.com",
    siteName: "Maria Rose Photography",
    images: [
      {
        url: "/mra-wide-logo.png",
        width: 1200,
        height: 630,
        alt: "Maria Rose Photography Portfolio Sample",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Maria Rose Photography | Detroit Area",
    description:
      "Creating timeless memories through natural light photography in Metro Detroit.",
    images: [
      {
        url: "/mra-wide-logo.png",
        alt: "Maria Rose Photography Portfolio",
      },
    ],
  },
  icons: {
    icon: [{ url: "/favicon.png" }],
    apple: [{ url: "/favicon.png" }],
  },
  manifest: "/site.webmanifest",
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${morgana.variable} antialiased`}
      >
        <Navbar />
        <main className="flex flex-col min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
