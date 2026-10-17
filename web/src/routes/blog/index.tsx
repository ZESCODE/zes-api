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
import { createFileRoute, Link } from '@tanstack/react-router'
import { Calendar, Clock } from 'lucide-react'

import {
  getBlogCategories,
  getBlogPosts,
  getFeaturedPost,
} from '@/features/blog/lib/blog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createFileRoute('/blog/')({
  component: BlogList,
})

function BlogList() {
  const posts = getBlogPosts()
  const categories = getBlogCategories()
  const featured = getFeaturedPost()

  return (
    <div className='min-h-screen bg-background'>
      <main className='relative z-10 pt-16 pb-20'>
        <div className='container mx-auto px-6 max-w-7xl'>
          <header className='mb-12'>
            <h1 className='text-3xl md:text-4xl font-bold text-foreground'>Blog</h1>
            <p className='text-muted-foreground mt-2'>
              Engineering notes, releases, and guides for the ZES AI gateway.
            </p>
          </header>

          {featured && (
            <section className='mb-12'>
              <div className='bg-surface-elevated border border-border rounded-2xl overflow-hidden'>
                <div className='grid md:grid-cols-2'>
                  <div className='relative aspect-[16/9]'>
                    <img
                      src={featured.coverImage}
                      alt={featured.title}
                      className='object-cover w-full h-full'
                    />
                  </div>
                  <div className='p-8 md:p-12 flex flex-col justify-between'>
                    <div>
                      <Badge variant='outline' className='border-primary/30 text-primary'>
                        {featured.category}
                      </Badge>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground mt-4'>
                        <Calendar className='w-4 h-4' />
                        <span>{new Date(featured.publishedAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}</span>
                      </div>
                      <div className='flex items-center gap-2 text-sm text-muted-foreground mt-1'>
                        <Clock className='w-4 h-4' />
                        <span>{featured.readTime}</span>
                      </div>
                    </div>
                    <div className='mt-6 flex items-end gap-4'>
                      <h2 className='text-2xl md:text-3xl font-bold text-foreground line-clamp-2'>
                        {featured.title}
                      </h2>
                      <Link to={`/blog/${featured.slug}`}>
                        <Button>Read article</Button>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='p-8 md:p-12 border-t border-border'>
                  <p className='text-muted-foreground text-lg leading-relaxed line-clamp-3'>
                    {featured.excerpt}
                  </p>
                </div>
              </div>
            </section>
          )}

          <section>
            <div className='flex flex-wrap items-center gap-4 mb-8'>
              <h2 className='text-xl font-semibold text-foreground'>All Articles</h2>
              {categories.map((category) => (
                <Link
                  key={category}
                  to='/blog/'
                  search={{ category }}
                  className='px-3 py-1.5 text-sm rounded-md border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors'
                >
                  {category}
                </Link>
              ))}
            </div>
            <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {posts.map((post) => (
                <Card key={post.slug} className='overflow-hidden hover:border-primary/30 transition-colors group'>
                  <div className='relative aspect-[16/9]'>
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className='object-cover w-full h-full group-hover:scale-105 transition-transform duration-300'
                    />
                  </div>
                  <div className='p-5'>
                    <div className='flex items-center gap-2 text-xs text-muted-foreground mb-3'>
                      <Badge variant='outline'>
                        {post.category}
                      </Badge>
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}</span>
                    </div>
                    <CardHeader>
                      <CardTitle className='line-clamp-2 group-hover:text-primary transition-colors'>
                        {post.title}
                      </CardTitle>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter className='flex items-center justify-between pt-4'>
                      <Link to={`/blog/${post.slug}`} className='text-sm font-medium text-primary hover:underline'>
                        Read more
                      </Link>
                      <span className='text-xs text-muted-foreground'>
                        {post.readTime}
                      </span>
                    </CardFooter>
                  </div>
                </Card>
              ))}
              {posts.length === 0 && (
                <div className='col-span-full text-center py-20'>
                  <p className='text-muted-foreground'>No articles found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
