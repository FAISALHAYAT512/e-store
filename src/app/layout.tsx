import "./globals.css"
import type { Metadata } from "next"
import Providers from "./providers"
import Navbar from "@/components/Navbar"

export const metadata: Metadata = {
  title: "Faisal Store",
  description: "Premium E-Commerce Store",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-black">
        <Providers>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  )
}