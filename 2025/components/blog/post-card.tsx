import Link from "next/link"
import Image from "next/image"
import { formatDate } from "@/lib/utils"
import type { BlogPost } from "@/lib/notion"

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="space-y-3">
        {/* Imagem do Post */}
        {post.coverImage && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.coverImage || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Conteúdo do Post */}
        <div className="space-y-2">
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
          <h3 className="text-lg font-medium group-hover:underline">{post.title}</h3>

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
