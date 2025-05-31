"use client"


import Link from "next/link"
import React from "react"
import { NavMenu } from "@/components/nav/links"


export function Header() {

  return (
    <header className="w-screen border-b border-[rgb(var(--caneta))] text-[var(--caneta)] ">
      <nav className="w-full self-stretch p-6 inline-flex justify-between items-center" aria-label="Global">
          {/* Logo */}
          <Link href="/" className="flex items-center order-1"><img src="/logotipo.svg" alt="logotipo" /></Link>

          {/* Links */}
          <div className="md:order-2 order-3"><NavMenu /></div>

          {/* Link do canal */}
          <Link href="/" className="md:order-3 order-2"><img src="/icones/fita.webp" alt="Visite meu canal" className="h-10" /></Link>
      </nav>
    </header>
  )
}
