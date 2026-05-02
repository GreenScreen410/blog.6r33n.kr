'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Link from '@/components/Link'
import Tag from '@/components/Tag'
import siteMetadata from '@/data/siteMetadata'

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

function PageButton({
  children,
  href,
  rel,
  disabled,
}: {
  children: ReactNode
  href?: string
  rel?: string
  disabled?: boolean
}) {
  const cls =
    'border-md3-outline text-md3-on-surface text-md3-label-lg hover:bg-md3-surface-container rounded-md3-full inline-flex h-10 items-center border px-5 transition-colors disabled:opacity-40'
  if (disabled || !href) {
    return (
      <button className={cls} disabled>
        {children}
      </button>
    )
  }
  return (
    <Link href={href} rel={rel} className={cls}>
      {children}
    </Link>
  )
}

function Pagination({ totalPages, currentPage }: PaginationProps) {
  const pathname = usePathname()
  const basePath = pathname
    .replace(/^\//, '')
    .replace(/\/page\/\d+\/?$/, '')
    .replace(/\/$/, '')
  const prevPage = currentPage - 1 > 0
  const nextPage = currentPage + 1 <= totalPages

  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <nav className="flex items-center justify-between">
        <PageButton
          href={
            prevPage
              ? currentPage - 1 === 1
                ? `/${basePath}/`
                : `/${basePath}/page/${currentPage - 1}`
              : undefined
          }
          rel="prev"
          disabled={!prevPage}
        >
          Previous
        </PageButton>
        <span className="text-md3-body-md text-md3-on-surface-variant">
          {currentPage} of {totalPages}
        </span>
        <PageButton
          href={nextPage ? `/${basePath}/page/${currentPage + 1}` : undefined}
          rel="next"
          disabled={!nextPage}
        >
          Next
        </PageButton>
      </nav>
    </div>
  )
}

export default function ListLayout({
  posts,
  title,
  initialDisplayPosts = [],
  pagination,
}: ListLayoutProps) {
  const [searchValue, setSearchValue] = useState('')
  const filteredBlogPosts = posts.filter((post) => {
    const searchContent = post.title + post.summary + post.tags?.join(' ')
    return searchContent.toLowerCase().includes(searchValue.toLowerCase())
  })

  const displayPosts =
    initialDisplayPosts.length > 0 && !searchValue ? initialDisplayPosts : filteredBlogPosts

  return (
    <>
      <div className="divide-md3-outline-variant divide-y">
        <div className="space-y-4 pt-6 pb-8 md:space-y-5">
          <h1 className="text-md3-headline-lg sm:text-md3-display-sm md:text-md3-display-md text-md3-on-surface tracking-tight">
            {title}
          </h1>
          <div className="relative max-w-lg">
            <label>
              <span className="sr-only">Search articles</span>
              <input
                aria-label="Search articles"
                type="text"
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search articles"
                className="border-md3-outline focus:border-md3-primary focus:ring-md3-primary bg-md3-surface-container-low text-md3-on-surface placeholder:text-md3-on-surface-variant rounded-md3-sm text-md3-body-lg block w-full border px-4 py-2.5"
              />
            </label>
            <svg
              className="text-md3-on-surface-variant absolute top-3 right-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <ul>
          {!filteredBlogPosts.length && (
            <li className="text-md3-on-surface-variant py-8">No posts found.</li>
          )}
          {displayPosts.map((post) => {
            const { path, date, title, summary, tags } = post
            return (
              <li key={path} className="py-5">
                <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
                  <dl>
                    <dt className="sr-only">Published on</dt>
                    <dd className="text-md3-body-md text-md3-on-surface-variant">
                      <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    </dd>
                  </dl>
                  <div className="space-y-3 xl:col-span-3">
                    <div>
                      <h3 className="text-md3-headline-sm tracking-tight">
                        <Link
                          href={`/${path}`}
                          className="text-md3-on-surface hover:text-md3-primary"
                        >
                          {title}
                        </Link>
                      </h3>
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
      </div>
      {pagination && pagination.totalPages > 1 && !searchValue && (
        <Pagination currentPage={pagination.currentPage} totalPages={pagination.totalPages} />
      )}
    </>
  )
}
