import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Script from "next/script"
import Header from "@/components/header"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Chargeway - Find EV Charging Stations Near You",
  description: "Locate the nearest electric vehicle charging stations, hospitals, restaurants, and more with our interactive map. Plan your route with Chargeway's real-time availability tracker.",
  keywords: "EV charging stations, electric vehicle, charging map, find chargers, EV infrastructure, Tesla chargers, CCS, CHAdeMO, Type 2",
  authors: [
    { name: "Zaid" }
  ],
  creator: "Chargeway Team",
  publisher: "Chargeway",
  robots: "index, follow",
  alternates: {
    canonical: "https://charge-way.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://charge-way.vercel.app",
    title: "Chargeway - Find EV Charging Stations Near You",
    description: "Locate the nearest electric vehicle charging stations, hospitals, restaurants, and more with our interactive map.",
    siteName: "Chargeway",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Chargeway - Find EV Charging Stations"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Chargeway - Find EV Charging Stations Near You",
    description: "Locate the nearest electric vehicle charging stations, hospitals, restaurants, and more with our interactive map.",
    images: ["/twitter-image.png"]
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png"
  },
  manifest: "/site.webmanifest"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css" rel="stylesheet" />
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>
        <Header />
        <main>{children}</main>
        <Footer />
        <Script src="https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}