import type { BlogPost } from "@/lib/notion"
import { PostCard } from "./post-card"

interface PostGridProps {
  posts: BlogPost[]
}

export function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
