import type React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { AutumnProvider } from "autumn-js/react";
import { AutumnCustomerProvider } from "@/hooks/useAutumnCustomer";
import "./globals.css";

export const metadata: Metadata = {
  title: "SenseiiWyze Dashboard",
  description: "AI-powered tech skill coaching platform",
  generator: "Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AutumnProvider 
            betterAuthUrl={process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"}
            backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL}
          >
            <AutumnCustomerProvider>
              {children}
            </AutumnCustomerProvider>
          </AutumnProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
