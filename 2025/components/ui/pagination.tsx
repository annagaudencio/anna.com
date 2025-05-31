import Link from "next/link"
import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
  hasNextPage: boolean
  cursor?: string | null
}

export function Pagination({ currentPage, totalPages, basePath, hasNextPage, cursor }: PaginationProps) {
  // Gera números de página para exibir
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Mostra todas as páginas se houver menos que maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Sempre inclui a primeira página
      pages.push(1)

      // Calcula o início e o fim do intervalo de páginas
      let start = Math.max(2, currentPage - 1)
      let end = Math.min(totalPages - 1, currentPage + 1)

      // Ajusta se estiver no início ou no fim
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, 4)
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - 3)
      }

      // Adiciona reticências se necessário
      if (start > 2) {
        pages.push(-1) // -1 representa reticências
      }

      // Adiciona páginas do meio
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Adiciona reticências se necessário
      if (end < totalPages - 1) {
        pages.push(-2) // -2 representa reticências
      }

      // Sempre inclui a última página
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex items-center justify-center space-x-1" aria-label="Paginação">
      {/* Botão de página anterior */}
      {currentPage > 1 ? (
        <Link
          href={`${basePath}/page/${currentPage - 1}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border))] text-sm text-muted-foreground hover:bg-muted"
          aria-label="Página anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border))] text-sm text-muted-foreground opacity-50">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {/* Números de página */}
      {pageNumbers.map((pageNumber, index) => {
        if (pageNumber < 0) {
          // Renderiza reticências
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          )
        }

        return (
          <Link
            key={pageNumber}
            href={`${basePath}/page/${pageNumber}`}
            className={cn(
              "inline-flex h-9 w-9 items-center justify-center rounded-md text-sm",
              currentPage === pageNumber
                ? "border-black bg-black text-white"
                : "border border-[rgb(var(--border))] text-muted-foreground hover:bg-muted",
            )}
            aria-current={currentPage === pageNumber ? "page" : undefined}
          >
            {pageNumber}
          </Link>
        )
      })}

      {/* Botão de próxima página */}
      {hasNextPage ? (
        <Link
          href={`${basePath}/page/${currentPage + 1}${cursor ? `?cursor=${cursor}` : ""}`}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border))] text-sm text-muted-foreground hover:bg-muted"
          aria-label="Próxima página"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[rgb(var(--border))] text-sm text-muted-foreground opacity-50">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  )
}

export const PaginationContent = React.forwardRef<
  React.ElementRef<typeof import("next/link").default>,
  React.ComponentPropsWithoutRef<typeof import("next/link").default>
>(({ className, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
      className,
    )}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

export const PaginationItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, ...props }, ref) => (
    <li>
      <a
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
          className,
        )}
        {...props}
      />
    </li>
  ),
)
PaginationItem.displayName = "PaginationItem"

export const PaginationLink = React.forwardRef<
  React.ElementRef<typeof import("next/link").default>,
  React.ComponentPropsWithoutRef<typeof import("next/link").default>
>(({ className, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground",
      className,
    )}
    {...props}
  />
))
PaginationLink.displayName = "PaginationLink"

export const PaginationEllipsis = React.forwardRef<React.ElementRef<"span">, React.ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      className={cn("h-9 w-9 items-center justify-center rounded-md text-sm font-medium", className)}
      {...props}
    >
      ...
    </span>
  ),
)
PaginationEllipsis.displayName = "PaginationEllipsis"

export const PaginationPrevious = React.forwardRef<
  React.ElementRef<typeof import("next/link").default>,
  React.ComponentPropsWithoutRef<typeof import("next/link").default>
>(({ className, children, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    <ChevronLeft className="mr-2 h-4 w-4" />
    {children}
  </Link>
))
PaginationPrevious.displayName = "PaginationPrevious"

export const PaginationNext = React.forwardRef<
  React.ElementRef<typeof import("next/link").default>,
  React.ComponentPropsWithoutRef<typeof import("next/link").default>
>(({ className, children, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    <ChevronRight className="ml-2 h-4 w-4" />
  </Link>
))
PaginationNext.displayName = "PaginationNext"
