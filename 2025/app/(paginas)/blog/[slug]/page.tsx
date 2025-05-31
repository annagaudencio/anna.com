import Image from "next/image"
import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/notion"
import { formatDate } from "@/lib/utils"
import Markdown from "react-markdown"

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  try {
    console.log(`Tentando buscar post com slug: ${params.slug}`)
    const post = await getPostBySlug(params.slug)

    if (!post) {
      console.log(`Post não encontrado para slug: ${params.slug}`)
      notFound()
    }

    return (
      <article className="py-12 md:py-16">
        {/* Cabeçalho */}
        <header className="mx-auto mb-8 max-w-3xl md:mb-12">
          {post.tags && post.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-sm text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="mb-6">{post.title}</h1>

          <div className="flex items-center text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.author.name && (
              <>
                <span className="mx-1">•</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
        </header>

        {/* Imagem de Capa */}
        {post.coverImage && (
          <div className="mx-auto mb-12 max-w-4xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
              <Image
                src={post.coverImage || "/placeholder.svg"}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          </div>
        )}

        {/* Conteúdo */}
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-lg">
            <Markdown>{post.content || ""}</Markdown>
          </div>
        </div>
      </article>
    )
  } catch (error) {
    console.error("Erro ao renderizar post do blog:", error)
    notFound()
  }
}
