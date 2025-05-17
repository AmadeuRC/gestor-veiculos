import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"
import { StorageInitializer } from "@/components/storage-initializer"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <StorageInitializer />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
