import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | Maria Rose Photography",
  description: "Administrative dashboard for Maria Rose Photography",
  metadataBase: new URL("https://www.photographymra.com"),
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="bg-primary/10">{children}</div>;
}
