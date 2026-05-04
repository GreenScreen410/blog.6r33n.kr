import Link from '@/components/Link'
import Image from '@/components/Image'
import DraftBadge from '@/components/DraftBadge'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import NewsletterForm from '@/components/NewsletterForm'
import { formatDate } from 'pliny/utils/formatDate'
import { slug as slugify } from 'github-slugger'
import tagData from 'app/tag-data.json'

const MAX_DISPLAY = 8

export default function Home({ posts, author }) {
  const tagCounts = tagData as Record<string, number>
  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a])
  const displayPosts = posts.slice(0, MAX_DISPLAY)

  return (
    <div className="flex flex-col gap-10 pt-8 sm:flex-row sm:gap-12">
      {/* ─────────── Sidebar ─────────── */}
      <aside className="shrink-0 sm:sticky sm:top-24 sm:w-64 sm:self-start">
        <div className="bg-md3-surface-container-low rounded-md3-lg p-6">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/static/images/avatar.png"
              alt={siteMetadata.author}
              width={96}
              height={96}
              className="rounded-full"
            />
            <h2 className="text-md3-title-lg text-md3-on-surface mt-4">
              {author?.name ?? siteMetadata.author}
            </h2>
            {(author?.occupation || author?.company) && (
              <p className="text-md3-body-sm text-md3-on-surface-variant mt-1">
                {author.occupation}
                {author.occupation && author.company && <br />}
                {author.company}
              </p>
            )}
            <div className="text-md3-on-surface-variant mt-4 flex justify-center gap-2">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} size={5} />
              <SocialIcon kind="github" href={siteMetadata.github} size={5} />
            </div>
          </div>
        </div>

        {sortedTags.length > 0 && (
          <div className="mt-6 px-2">
            <h3 className="text-md3-label-lg text-md3-on-surface-variant mb-3 uppercase">Tags</h3>
            <ul className="flex flex-wrap gap-2">
              {sortedTags.map((t) => (
                <li key={t}>
                  <Link
                    href={`/tags/${slugify(t)}`}
                    className="bg-md3-secondary-container text-md3-on-secondary-container hover:bg-md3-tertiary-container hover:text-md3-on-tertiary-container text-md3-label-md rounded-md3-sm inline-flex h-7 items-center px-2.5 transition-colors"
                  >
                    {t} ({tagCounts[t]})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <nav className="mt-6 flex flex-col px-2">
          <Link
            href="/blog"
            className="text-md3-on-surface hover:bg-md3-surface-container text-md3-label-lg rounded-md3-full inline-flex h-10 items-center px-3 transition-colors"
          >
            All Posts →
          </Link>
          <Link
            href="/about"
            className="text-md3-on-surface hover:bg-md3-surface-container text-md3-label-lg rounded-md3-full inline-flex h-10 items-center px-3 transition-colors"
          >
            About
          </Link>
        </nav>
      </aside>

      {/* ─────────── Main content ─────────── */}
      <main className="min-w-0 flex-1">
        <header className="mb-6 flex items-baseline justify-between">
          <h1 className="text-md3-headline-md sm:text-md3-headline-lg text-md3-on-surface tracking-tight">
            최근 글
          </h1>
          {posts.length > MAX_DISPLAY && (
            <Link
              href="/blog"
              className="text-md3-primary text-md3-label-lg hover:bg-md3-primary-container rounded-md3-full inline-flex h-9 items-center px-3 transition-colors"
            >
              전체 보기 →
            </Link>
          )}
        </header>

        {!posts.length ? (
          <p className="text-md3-on-surface-variant text-md3-body-lg py-12 text-center">
            아직 작성된 글이 없습니다.
          </p>
        ) : (
          <ul className="divide-md3-outline-variant divide-y">
            {displayPosts.map((post) => (
              <li key={post.slug}>
                <PostListItem post={post} />
              </li>
            ))}
          </ul>
        )}

        {siteMetadata.newsletter?.provider && (
          <div className="bg-md3-surface-container-low rounded-md3-lg mt-12 p-6 sm:p-8">
            <NewsletterForm />
          </div>
        )}
      </main>
    </div>
  )
}

function PostListItem({ post }) {
  const { slug, date, title, summary, tags, draft } = post
  return (
    <article className="group py-6">
      <div className="text-md3-label-md text-md3-on-surface-variant mb-2 flex items-center gap-2 uppercase">
        <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
        <DraftBadge draft={draft} />
      </div>
      <h2 className="text-md3-title-lg sm:text-md3-headline-sm tracking-tight">
        <Link href={`/blog/${slug}`} className="text-md3-on-surface hover:text-md3-primary">
          {title}
        </Link>
      </h2>
      {summary && (
        <p className="text-md3-body-md text-md3-on-surface-variant mt-2 line-clamp-2">{summary}</p>
      )}
      {tags && tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${slugify(tag)}`}
              className="bg-md3-secondary-container text-md3-on-secondary-container hover:bg-md3-tertiary-container hover:text-md3-on-tertiary-container text-md3-label-md rounded-md3-sm inline-flex h-7 items-center px-2.5 transition-colors"
            >
              {tag.split(' ').join('-')}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
