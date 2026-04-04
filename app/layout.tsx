import type React from "react"
import "./globals.css"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { AppLayout } from "@/components/skincare/app-layout"

const inter = Inter({ 
  subsets: ["latin"], 
  display: "swap",
  variable: "--font-inter"
})

const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  display: "swap",
  variable: "--font-playfair"
})

export const metadata: Metadata = {
  title: "Skin Sync Aura | Your Personalized Skincare Companion",
  description:
    "Track your skincare products, build perfect routines, detect ingredient conflicts, and achieve your best skin with AI-powered recommendations.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#FDF8F3",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans gradient-cream min-h-screen">
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  )
}
