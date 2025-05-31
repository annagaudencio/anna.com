"use client"

import { Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import Link from "next/link"

const navigation = [
    // { name: "Início", href: "/" },
    { name: "Portfolio", href: "/portfolio" },
    { name: "Sobre", href: "/sobre" },
    { name: "Feed", href: "/blog" },
    { name: "Canal", href: "#" },
    { name: "Contratar", href: "#"}
  ]

export function NavMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div>
            <div>
                {/* Menu mobile */}
                <div className="flex lg:hidden">
                    <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                    onClick={() => setMobileMenuOpen(true)}
                    >
                    <span className="sr-only">Abrir menu principal</span>
                    <img src="/icones/menu.svg" alt="" />
                    </button>
                </div>

                {/* Menu desktop */}
                <div className="hidden lg:flex lg:gap-x-2">
                    {navigation.map((item) => (
                    <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                    "menu",
                    pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                        ? "font-medium"
                        : "!px-1 hover:!bg-[var(--amarelo)]",
                    )}
                    >
                    [ {item.name} ]
                    </Link>
                    ))}
                </div>
            </div>


            {/* Menu mobile expandido */}
            {mobileMenuOpen && (
            <div className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                
                <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm">
                    {/* Topo e botão de fechar */}
                    <div className="flex items-center justify-between">
                        {/* Visite o canal */}
                        <Link href="/"><img src="/icones/fita.webp" alt="Visite meu canal" className="h-10" /></Link>

                        <button type="button" className="rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
                            <span className="sr-only">Fechar menu</span>
                            <X className="h-5 w-5" aria-hidden="true" />
                        </button>
                    </div>
                    
                    {/* Links */}
                    <div className="mt-6 flow-root">
                        <div className="space-y-2 py-6">
                            {navigation.map((item) => (
                            <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                            "block py-2 text-base",
                            pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href))
                                ? "font-medium"
                                : "text-muted-foreground",
                            )}
                            onClick={() => setMobileMenuOpen(false)}
                            >
                            {item.name}
                            </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    )
}