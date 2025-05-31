import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/lib/notion"

interface FeaturedPostProps {
  post: BlogPost
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        {/* Imagem de Capa */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted md:aspect-square">
          {post.coverImage ? (
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="absolute inset-0 bg-muted" />
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col justify-center space-y-4">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 1).map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Título */}
          <h2 className="text-2xl font-medium group-hover:underline md:text-3xl">{post.title}</h2>

          {/* Resumo */}
          {post.excerpt && <p className="text-muted-foreground">{post.excerpt}</p>}

          {/* Data e Autor */}
          <div className="flex items-center text-sm text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.author.name && (
              <>
                <span className="mx-1">•</span>
                <span>{post.author.name}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
