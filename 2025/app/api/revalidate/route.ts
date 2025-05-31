import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// Este manipulador de rota será usado para acionar manualmente a revalidação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, token } = body

    // Validação simples de token - em produção, use um método mais seguro
    if (token !== process.env.REVALIDATION_TOKEN) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 })
    }

    if (!path) {
      return NextResponse.json({ message: "Caminho é obrigatório" }, { status: 400 })
    }

    // Revalida o caminho específico
    revalidatePath(path)

    return NextResponse.json({ revalidated: true, message: `Caminho ${path} revalidado.` })
  } catch (error) {
    return NextResponse.json({ message: "Erro ao revalidar", error }, { status: 500 })
  }
}
