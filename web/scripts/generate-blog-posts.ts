import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'

const ROOT = path.dirname(new URL(import.meta.url).pathname)
const WEB_DIR = path.resolve(ROOT, '..')
const BLOG_DIR = path.join(WEB_DIR, 'content', 'blog')
const OUT_FILE = path.join(
  WEB_DIR,
  'src',
  'features',
  'blog',
  'lib',
  'data',
  'posts.json'
)

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '')
}

function estimateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 200))} min read`
}

function parsePost(fileName: string) {
  const slug = fileName.replace(/\.md$/, '')
  const raw = fs.readFileSync(path.join(BLOG_DIR, fileName), 'utf8')
  const { data, content } = matter(raw)

  return {
    slug,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ''),
    content: content.trim(),
    author: {
      name: String(data.author?.name ?? 'ZES Team'),
      role: String(data.author?.role ?? ''),
      avatar: String(data.author?.avatar ?? '/placeholder-logo.svg'),
    },
    category: String(data.category ?? 'General'),
    publishedAt: toDateString(data.publishedAt),
    readTime: data.readTime ? String(data.readTime) : estimateReadTime(content),
    coverImage: String(data.coverImage ?? '/placeholder.svg'),
    featured: Boolean(data.featured),
    draft: Boolean(data.draft),
  }
}

function main() {
  if (!fs.existsSync(BLOG_DIR)) {
    console.error(`Blog directory not found: ${BLOG_DIR}`)
    process.exit(1)
  }

  const posts = fs
    .readdirSync(BLOG_DIR)
    .filter((fileName) => fileName.endsWith('.md') && !fileName.startsWith('_'))
    .map(parsePost)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true })
  fs.writeFileSync(OUT_FILE, JSON.stringify(posts, null, 2) + '\n', 'utf8')

  console.log(`Generated ${posts.length} blog post(s) -> ${OUT_FILE}`)
}

main()
