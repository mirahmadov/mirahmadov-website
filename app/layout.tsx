import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "mirahmadov",
  description: "A quiet place.",
  authors: [{ name: "Muhammadaziz Mirakhmadov" }],
  openGraph: {
    title: "mirahmadov",
    description: "A quiet place.",
    url: "https://mirahmadov.uz",
    siteName: "mirahmadov",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0b0f14" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
