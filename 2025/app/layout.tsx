import type React from "react"
import { Header } from "@/components/nav/header"
import "@/estilos/globals.css"
import Link from "next/link"
import { getPosts } from "@/lib/notion"

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
      <body className="antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  )
}
