import { Cormorant_Infant } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";
import { Toaster } from "sonner";

const cormorantInfant = Cormorant_Infant({
  weight: "400",
  variable: "--font-cormorant-infant",
  subsets: ["latin"],
});

const morgana = localFont({
  src: "../public/font/Morgana.otf",
  variable: "--font-morgana",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorantInfant.variable} ${morgana.variable} antialiased`}
        suppressHydrationWarning
      >
        <main className="min-h-screen">
          {children}
          <Toaster theme="light" richColors />
        </main>
      </body>
    </html>
  );
}
