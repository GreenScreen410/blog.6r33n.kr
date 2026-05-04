import { ReactNode } from 'react'
import { formatDate } from 'pliny/utils/formatDate'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import ReadingProgress from '@/components/ReadingProgress'

interface LayoutProps {
  content: CoreContent<Blog>
  children: ReactNode
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
}

export default function PostLayout({ content, next, prev, children }: LayoutProps) {
  const { path, slug, date, title, readingTime } = content
  const readMinutes = readingTime ? Math.max(1, Math.ceil(readingTime.minutes)) : null

  return (
    <SectionContainer>
      <ReadingProgress />
      <ScrollTopAndComment />
      <article>
        <div>
          <header>
            <div className="border-md3-outline-variant space-y-1 border-b pb-10 text-center">
              <dl>
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-md3-body-md text-md3-on-surface-variant flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                    <time dateTime={date}>{formatDate(date, siteMetadata.locale)}</time>
                    {readMinutes && <span>· {readMinutes}분 읽기</span>}
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="divide-md3-outline-variant grid-rows-[auto_1fr] divide-y pb-8 xl:divide-y-0">
            <div className="divide-md3-outline-variant divide-y xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose dark:prose-invert max-w-none pt-10 pb-8">{children}</div>
            </div>
            {siteMetadata.comments && (
              <div className="text-md3-on-surface pt-6 pb-6 text-center" id="comment">
                <Comments slug={slug} />
              </div>
            )}
            <footer>
              <div className="flex flex-col text-sm font-medium sm:flex-row sm:justify-between sm:text-base">
                {prev && prev.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${prev.path}`}
                      className="text-md3-primary hover:underline"
                      aria-label={`Previous post: ${prev.title}`}
                    >
                      &larr; {prev.title}
                    </Link>
                  </div>
                )}
                {next && next.path && (
                  <div className="pt-4 xl:pt-8">
                    <Link
                      href={`/${next.path}`}
                      className="text-md3-primary hover:underline"
                      aria-label={`Next post: ${next.title}`}
                    >
                      {next.title} &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
