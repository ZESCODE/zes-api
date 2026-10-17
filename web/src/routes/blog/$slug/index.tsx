/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'

import type { BlogPost } from '@/features/blog/types'
import { getBlogPost, getBlogPosts } from '@/features/blog/lib/blog'
import { Markdown } from '@/components/ui/markdown'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/blog/$slug')({
  beforeLoad: ({ params }) => {
    const post = getBlogPost(params.slug)
    if (!post) {
      throw notFound()
    }
    return { post }
  },
  component: BlogPost,
})

function BlogPost({ post }: { post: BlogPost }) {
  const relatedPosts = getBlogPosts()
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 2)

  return (
    <div className='min-h-screen bg-background'>
      <main className='relative z-10 pt-16 pb-20'>
        <div className='container mx-auto px-6 max-w-4xl'>
          <Link to='/blog/' className='inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8'>
            <ArrowLeft className='w-4 h-4' />
            Back to Blog
          </Link>

          <header className='mb-10'>
            <div className='flex items-center gap-3 mb-4'>
              <Badge variant='outline' className='border-primary/30 text-primary'>
                {post.category}
              </Badge>
              <span className='text-sm text-muted-foreground flex items-center gap-1.5'>
                <Calendar className='w-4 h-4' />
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className='text-sm text-muted-foreground flex items-center gap-1.5'>
                <Clock className='w-4 h-4' />
                {post.readTime}
              </span>
            </div>
            <h1 className='text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6'>
              {post.title}
            </h1>
            <p className='text-xl text-muted-foreground'>{post.excerpt}</p>
          </header>

          <div className='flex items-center gap-4 mb-10 pb-10 border-b border-border'>
            <div className='flex items-center gap-4'>
              <img
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className='rounded-full'
              />
              <div>
                <p className='font-medium text-foreground'>{post.author.name}</p>
                <p className='text-sm text-muted-foreground'>{post.author.role}</p>
              </div>
            </div>
          </div>

          <div className='relative aspect-[21/9] mb-12 rounded-xl overflow-hidden'>
            <img
              src={post.coverImage}
              alt={post.title}
              className='object-cover w-full h-full'
            />
          </div>

          <Markdown>{post.content}</Markdown>

          {relatedPosts.length > 0 && (
            <section className='mt-16 pt-16 border-t border-border'>
              <h2 className='text-2xl font-bold text-foreground mb-8'>
                Related Articles
              </h2>
              <div className='grid md:grid-cols-2 gap-6'>
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    to={`/blog/${related.slug}`}
                    className='group'
                  >
                    <div className='bg-surface-elevated border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors'>
                      <div className='relative aspect-[16/9]'>
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className='object-cover w-full h-full'
                        />
                      </div>
                      <div className='p-4'>
                        <h3 className='font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2'>
                          {related.title}
                        </h3>
                        <p className='text-sm text-muted-foreground mt-2'>
                          {related.readTime}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
