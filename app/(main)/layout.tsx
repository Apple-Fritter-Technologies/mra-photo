import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "Maria Rose Photography | Metro Detroit Lifestyle Photographer",
  description:
    "Professional natural light and lifestyle photography services in Metro Detroit. Specializing in portraits, families, and special events. Book your session today.",
  metadataBase: new URL("https://www.photographymra.com"),
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
    url: "https://www.photographymra.com",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-32 md:mt-36 overflow-hidden">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
