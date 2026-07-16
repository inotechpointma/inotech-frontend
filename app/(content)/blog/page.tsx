import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPosts } from "@/lib/wordpress/posts";
import { Pagination } from "@/components/shop/Pagination";

export const metadata: Metadata = { title: "Blog" };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams;
  const page = pageParam ? Number(pageParam) : 1;
  const { posts, totalPages } = await getPosts(page);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Blog</h1>

      <div className="flex flex-col gap-8">
        {posts.map((post) => {
          const image = post._embedded?.["wp:featuredmedia"]?.[0];
          return (
            <article key={post.id} className="flex gap-4">
              {image ? (
                <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded bg-surface-alt">
                  <Image src={image.source_url} alt={image.alt_text || post.title.rendered} fill sizes="128px" className="object-cover" />
                </div>
              ) : null}
              <div>
                <Link href={`/blog/${post.slug}`} className="text-lg font-semibold hover:text-brand">
                  <span dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
                </Link>
                <div className="mt-1 text-sm text-ink-muted" dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }} />
              </div>
            </article>
          );
        })}
      </div>

      <Pagination currentPage={page} totalPages={totalPages} buildHref={(p) => `/blog?page=${p}`} />
    </div>
  );
}
