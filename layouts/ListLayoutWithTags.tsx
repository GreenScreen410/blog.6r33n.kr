'use client'

import { usePathname } from 'next/navigation'
import { slug } from 'github-slugger'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'
import tagData from 'app/tag-data.json'

interface PaginationProps {
  totalPages: number
  currentPage: number
}
interface ListLayoutProps {
  posts: CoreContent<Blog>[]
  title: string
  initialDisplayPosts?: CoreContent<Blog>[]
  pagination?: PaginationProps
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  const buttonCls =
    'border-md3-outline text-md3-on-surface text-md3-label-lg hover:bg-md3-surface-container rounded-md3-full inline-flex h-10 items-center border px-5 transition-colors disabled:opacity-40'

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex items-center justify-between">
        {!prevPage ? (
          <button className={buttonCls} disabled>
            Previous
          </button>
        ) : (
          <Link
            href={currentPage - 1 === 1 ? `/${basePath}/` : `/${basePath}/page/${currentPage - 1}`}
            rel="prev"
            className={buttonCls}
          >
            Previous
          </Link>
        )}
        <span className="text-md3-body-md text-md3-on-surface-variant">
          {currentPage} of {totalPages}
        </span>
        {!nextPage ? (
          <button className={buttonCls} disabled>
            Next
          </button>
        ) : (
          <Link href={`/${basePath}/page/${currentPage + 1}`} rel="next" className={buttonCls}>
            Next
          </Link>
        )}
      </nav>
    </div>
  )
}

export default function ListLayoutWithTags({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  const displayPosts = initialDisplayPosts.length > 0 ? initialDisplayPosts : posts

  return (
    <>
      <div>
        <div className="pt-6 pb-6">
          <h1 className="text-md3-headline-lg sm:text-md3-display-sm md:text-md3-display-md text-md3-on-surface tracking-tight sm:hidden">
            {title}
          </h1>
        </div>
        <div className="flex sm:space-x-12">
          <aside className="bg-md3-surface-container-low rounded-md3-md hidden h-full max-h-screen max-w-[280px] min-w-[260px] flex-wrap overflow-auto pt-5 sm:flex">
            <div className="px-6 py-4">
              {pathname.startsWith('/blog') ? (
                <h3 className="text-md3-primary text-md3-label-lg uppercase">All Posts</h3>
              ) : (
                <Link
                  href={`/blog`}
                  className="hover:text-md3-primary text-md3-on-surface text-md3-label-lg uppercase"
                >
                  All Posts
                </Link>
              )}
              <ul className="mt-3 space-y-1">
                {sortedTags.map((t) => {
                  const isActive = decodeURI(pathname.split('/tags/')[1]) === slug(t)
                  return (
                    <li key={t}>
                      {isActive ? (
                        <span className="bg-md3-secondary-container text-md3-on-secondary-container rounded-md3-full text-md3-label-md inline-block px-3 py-1.5 uppercase">
                          {`${t} (${tagCounts[t]})`}
                        </span>
                      ) : (
                        <Link
                          href={`/tags/${slug(t)}`}
                          className="hover:bg-md3-surface-container text-md3-on-surface-variant rounded-md3-full text-md3-label-md inline-block px-3 py-1.5 uppercase transition-colors"
                          aria-label={`View posts tagged ${t}`}
                        >
                          {`${t} (${tagCounts[t]})`}
                        </Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </aside>
          <div className="min-w-0 flex-1">
            <ul className="divide-md3-outline-variant divide-y">
              {displayPosts.map((post) => {
                const { path, date, title, summary, tags } = post
                return (
                  <li key={path} className="py-6">
                    <article className="flex flex-col space-y-2 xl:space-y-0">
                      <dl>
                        <dt className="sr-only">Published on</dt>
                        <dd className="text-md3-body-md text-md3-on-surface-variant">
                          <time dateTime={date} suppressHydrationWarning>
                            {formatDate(date, siteMetadata.locale)}
                          </time>
                        </dd>
                      </dl>
                      <div className="space-y-3">
                        <div>
                          <h2 className="text-md3-headline-sm tracking-tight">
                            <Link
                              href={`/${path}`}
                              className="text-md3-on-surface hover:text-md3-primary"
                            >
                              {title}
                            </Link>
                          </h2>
                          <div className="mt-2 flex flex-wrap">
                            {tags?.map((tag) => (
                              <Tag key={tag} text={tag} />
                            ))}
                          </div>
                        </div>
                        <div className="prose text-md3-on-surface-variant text-md3-body-lg max-w-none">
                          {summary}
                        </div>
                      </div>
                    </article>
                  </li>
                )
              })}
            </ul>
            {pagination && pagination.totalPages > 1 && (
              <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
