import type { Metadata, Viewport } from "next";
import "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "अतिथि देवो भव | Atithi Devo Bhava - Experience India through its people",
  description: "Meet locals. Explore cultures. Experience Indian hospitality. A trusted platform connecting international travellers with Indian local people, families, artists and communities.",
  keywords: ["India travel", "cultural hospitality", "homestay India", "Mithila culture", "Darbhanga", "Madhubani", "meet locals India"],
};

export const viewport: Viewport = {
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
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-page text-text antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content / मुख्य सामग्री पर जाएं
        </a>
        <main id="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
