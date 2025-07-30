import type React from "react"
import "./globals.css"

// Root layout in next-intl App Router should NOT contain HTML structure
// All HTML should be in the [locale] layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
