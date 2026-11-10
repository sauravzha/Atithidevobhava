import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "अतिथि देवो भव | Atithi Devo Bhava - Experience India through its people",
  description: "Meet locals. Explore cultures. Experience Indian hospitality. A trusted platform connecting international travellers with Indian local people, families, artists and communities.",
  keywords: ["India travel", "cultural hospitality", "homestay India", "Mithila culture", "Darbhanga", "Madhubani", "meet locals India"],
  alternates: {
    canonical: "https://atithidevobhava.in",
    languages: {
      en: "https://atithidevobhava.in",
      hi: "https://atithidevobhava.in/hi",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate supported locale
  if (!routing.locales.includes(locale as "en" | "hi")) {
    notFound();
  }

  // Load locale messages
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-page text-text antialiased font-body flex flex-col justify-between">
        <a href="#main-content" className="skip-link">
          Skip to main content / मुख्य सामग्री पर जाएं
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
