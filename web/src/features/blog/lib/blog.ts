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

import type { BlogPost } from '@/features/blog/types'

import postsManifest from './data/posts.json'

const WORDS_PER_MINUTE = 200

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / WORDS_PER_MINUTE))} min read`
}

function normalizePost(
  post: BlogPost & { draft?: boolean; readTime?: string }
): BlogPost {
  return {
    ...post,
    draft: Boolean(post.draft),
    readTime:
      post.readTime ??
      estimateReadTime(post.content),
    featured: Boolean(post.featured),
  }
}

export function getBlogPosts(): BlogPost[] {
  return postsManifest
    .map(normalizePost)
    .filter((post) => !post.draft)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getBlogPosts().find((post) => post.slug === slug)
}

export function getFeaturedPost(): BlogPost | undefined {
  return getBlogPosts().find((post) => post.featured)
}

export function getBlogCategories(): string[] {
  const seen = new Set<string>()
  for (const post of getBlogPosts()) {
    seen.add(post.category)
  }
  return ['All', ...seen]
}
