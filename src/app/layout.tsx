import { AutumnProvider } from 'autumn-js/react'
import type { Metadata } from 'next'
import { Roboto, Space_Grotesk } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import type React from 'react'
import { AutumnCustomerProvider } from '@/hooks/useAutumnCustomer'
import './globals.css'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--display-family',
})

const space_grotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--text-family',
})

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
      className={`${roboto.variable} ${space_grotesk.variable}`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AutumnProvider
            betterAuthUrl={process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'http://localhost:3000'}
            backendUrl={process.env.NEXT_PUBLIC_AUTUMN_BACKEND_URL}
          >
            <AutumnCustomerProvider>{children}</AutumnCustomerProvider>
          </AutumnProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
