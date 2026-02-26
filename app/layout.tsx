import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Provider from "@/components/Provider"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
  <html lang="ar" dir="rtl">
        <body className="font-sans antialiased" >
          <Provider>
  {children}
          </Provider>
          <Analytics />
        </body>
      </html>
   
  ) 
}