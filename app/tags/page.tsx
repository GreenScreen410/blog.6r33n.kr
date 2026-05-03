import Link from '@/components/Link'
import { slug } from 'github-slugger'
import tagData from 'app/tag-data.json'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Tags', description: 'Things I blog about' })

export default async function Page() {
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])
  const totalPosts = tagKeys.reduce((sum, t) => sum + tagCounts[t], 0)

  return (
    <div className="pt-8 pb-16">
      <header className="mb-10 space-y-3">
        <h1 className="text-md3-headline-lg sm:text-md3-display-sm md:text-md3-display-md text-md3-on-surface tracking-tight">
          Tags
        </h1>
        <p className="text-md3-body-lg text-md3-on-surface-variant">
          {tagKeys.length}개 태그 · 총 {totalPosts}개 글
        </p>
      </header>

      {tagKeys.length === 0 ? (
        <p className="text-md3-on-surface-variant text-md3-body-lg py-12 text-center">
          아직 태그가 없습니다.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {sortedTags.map((t) => (
            <li key={t}>
              <Link
                href={`/tags/${slug(t)}`}
                aria-label={`View ${tagCounts[t]} posts tagged ${t}`}
                className="bg-md3-secondary-container text-md3-on-secondary-container hover:bg-md3-tertiary-container hover:text-md3-on-tertiary-container hover:shadow-md3-1 ease-md3-standard rounded-md3-full text-md3-label-lg group inline-flex h-11 items-center gap-2 px-5 transition-all"
              >
                <span>#{t.split(' ').join('-')}</span>
                <span className="bg-md3-on-secondary-container/15 group-hover:bg-md3-on-tertiary-container/15 text-md3-label-md inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5">
                  {tagCounts[t]}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
