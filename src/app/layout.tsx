// import { AutumnProvider } from 'autumn-js/react'
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import type React from 'react'
import { Geist, Geist_Mono } from "next/font/google";
// import { AutumnCustomerProvider } from '@/hooks/useAutumnCustomer'
import './globals.css'
import { AutumnProvider } from "autumn-js/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: 'SenseiiWyze Dashboard',
  description: 'AI-powered tech skill coaching platform',
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <AutumnProvider
            betterAuthUrl={process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'}
            backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL}
          >
            <AutumnCustomerProvider>{children}</AutumnCustomerProvider>
          </AutumnProvider> */}
          <AutumnProvider>
            {children}
          </AutumnProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
