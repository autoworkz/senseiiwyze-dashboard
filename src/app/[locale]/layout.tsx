import type React from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
// import { GeistSans } from "geist/font/sans";
// import { GeistMono } from "geist/font/mono";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "SenseiiWyze Dashboard",
    description: "AI-powered tech skill coaching platform",
    generator: "Next.js",
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();
  console.log("Translated Messages:", messages);
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>{children}</ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
  //   return (
  //     <html lang={locale}>
  //       <head>
  //         {/* <style>{`
  // html {
  //   font-family: ${GeistSans.style.fontFamily};
  //   --font-sans: ${GeistSans.variable};
  //   --font-mono: ${GeistMono.variable};
  // }
  //         `}</style> */}
  //       </head>
  //       <body>
  //         <NextIntlClientProvider messages={messages}>
  //           <ThemeProvider>{children}</ThemeProvider>
  //         </NextIntlClientProvider>
  //       </body>
  //     </html>
  //   );
}
