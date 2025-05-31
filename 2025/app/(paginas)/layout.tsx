import type React from "react"
import { Footer } from "@/components/nav/footer"
import "@/estilos/globals.css"

export const metadata = {
  title: "Anna Gaudencio",
  description: "Web/UI designer e dev font end",
  icons: {
    icon: "/icon_azul.svg",
    shortcut: "/icon_azul.svg",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
