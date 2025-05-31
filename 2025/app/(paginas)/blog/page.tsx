import { getPosts } from "@/lib/notion"
import { PostCard } from "@/components/blog/post-card"
import { Pagination } from "@/components/ui/pagination"

const POSTS_PER_PAGE = 9

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: { page: string }
  searchParams: { cursor?: string }
}) {
  const pageNumber = Number.parseInt(params.page, 10) || 1
  const cursor = searchParams.cursor || undefined

  if (pageNumber < 1) {
    return { notFound: true }
  }

  const { posts, nextCursor, hasMore } = await getPosts(POSTS_PER_PAGE, cursor)

  // Calcula o total de páginas - esta é uma aproximação, já que estamos usando paginação baseada em cursor
  const totalPages = Math.max(pageNumber, posts.length === 0 ? 1 : pageNumber + (hasMore ? 1 : 0))

  return (
    <div className="p-12 md:p-16">
      <div className="mb-12 md:mb-16">
        <h1 className="mb-4 text-center">Blog</h1>
        <p className="mx-auto max-w-2xl text-center text-muted-foreground">
          Explore nossos artigos e insights mais recentes
        </p>
      </div>

      {posts.length > 0 ? (
        <>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          <div className="mt-12">
            <Pagination
              currentPage={pageNumber}
              totalPages={totalPages}
              basePath="/blog"
              hasNextPage={hasMore}
              cursor={nextCursor}
            />
          </div>
        </>
      ) : (
        <div className="py-16 text-center">
          <h2 className="mb-4 text-xl font-medium">Nenhum post encontrado</h2>
          <p className="text-muted-foreground">
            Não há posts de blog disponíveis no momento. Por favor, volte mais tarde.
          </p>
        </div>
      )}
    </div>
  )
}
