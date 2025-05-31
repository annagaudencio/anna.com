import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
      <h2 className="mb-4 text-2xl font-medium">Página Não Encontrada</h2>
      <p className="mb-8 text-muted-foreground">
        Desculpe, não conseguimos encontrar a página que você está procurando.
      </p>
      <Link href="/" className="notion-button">
        Voltar para Início
      </Link>
    </div>
  )
}
