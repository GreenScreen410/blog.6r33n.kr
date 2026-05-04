import { ReactNode } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import type { Blog, Authors } from 'contentlayer/generated'
import Comments from '@/components/Comments'
import Link from '@/components/Link'
import PageTitle from '@/components/PageTitle'
import SectionContainer from '@/components/SectionContainer'
import Image from '@/components/Image'
import Tag from '@/components/Tag'
import DraftBadge from '@/components/DraftBadge'
import siteMetadata from '@/data/siteMetadata'
import ScrollTopAndComment from '@/components/ScrollTopAndComment'
import ReadingProgress from '@/components/ReadingProgress'

const editUrl = (path) => `${siteMetadata.siteRepo}/blob/main/data/${path}`
const discussUrl = (path) =>
  `https://mobile.twitter.com/search?q=${encodeURIComponent(`${siteMetadata.siteUrl}/${path}`)}`

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}

interface LayoutProps {
  content: CoreContent<Blog>
  authorDetails: CoreContent<Authors>[]
  next?: { path: string; title: string }
  prev?: { path: string; title: string }
  children: ReactNode
}

export default function PostLayout({ content, authorDetails, next, prev, children }: LayoutProps) {
  const { filePath, path, slug, date, title, tags, draft, readingTime } = content
  const basePath = path.split('/')[0]
  const readMinutes = readingTime ? Math.max(1, Math.ceil(readingTime.minutes)) : null

  return (
    <SectionContainer>
      <ReadingProgress />
      <ScrollTopAndComment />
      <article>
        <div className="xl:divide-md3-outline-variant xl:divide-y">
          <header className="pt-6 xl:pb-6">
            <div className="space-y-1 text-center">
              <dl className="space-y-10">
                <div>
                  <dt className="sr-only">Published on</dt>
                  <dd className="text-md3-body-md text-md3-on-surface-variant flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
                    <time dateTime={date}>
                      {new Date(date).toLocaleDateString(siteMetadata.locale, postDateTemplate)}
                    </time>
                    {readMinutes && <span aria-label="Reading time">· {readMinutes}분 읽기</span>}
                    <DraftBadge draft={draft} />
                  </dd>
                </div>
              </dl>
              <div>
                <PageTitle>{title}</PageTitle>
              </div>
            </div>
          </header>
          <div className="divide-md3-outline-variant grid-rows-[auto_1fr] divide-y pb-8 xl:grid xl:grid-cols-4 xl:gap-x-6 xl:divide-y-0">
            <dl className="xl:border-md3-outline-variant pt-6 pb-10 xl:border-b xl:pt-11">
              <dt className="sr-only">Authors</dt>
              <dd>
                <ul className="flex flex-wrap justify-center gap-4 sm:space-x-12 xl:block xl:space-y-8 xl:space-x-0">
                  {authorDetails.map((author) => (
                    <li className="flex items-center space-x-2" key={author.name}>
                      {author.avatar && (
                        <Image
                          src={author.avatar}
                          width={38}
                          height={38}
                          alt="avatar"
                          className="h-10 w-10 rounded-full"
                        />
                      )}
                      <dl className="text-md3-body-md whitespace-nowrap">
                        <dt className="sr-only">Name</dt>
                        <dd className="text-md3-on-surface">{author.name}</dd>
                        <dt className="sr-only">Twitter</dt>
                        <dd>
                          {author.twitter && (
                            <Link
                              href={author.twitter}
                              className="text-md3-primary hover:underline"
                            >
                              {author.twitter
                                .replace('https://twitter.com/', '@')
                                .replace('https://x.com/', '@')}
                            </Link>
                          )}
                        </dd>
                      </dl>
                    </li>
                  ))}
                </ul>
              </dd>
            </dl>
            <div className="divide-md3-outline-variant divide-y xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose dark:prose-invert text-md3-body-lg max-w-none pt-10 pb-8">
                {children}
              </div>
              <div className="text-md3-body-md text-md3-on-surface-variant pt-6 pb-6">
                <Link href={discussUrl(path)} rel="nofollow" className="hover:text-md3-primary">
                  Discuss on Twitter
                </Link>
                {` • `}
                <Link href={editUrl(filePath)} className="hover:text-md3-primary">
                  View on GitHub
                </Link>
              </div>
              {siteMetadata.comments && (
                <div className="text-md3-on-surface pt-6 pb-6 text-center" id="comment">
                  <Comments slug={slug} />
                </div>
              )}
            </div>
            <footer>
              <div className="xl:divide-md3-outline-variant text-md3-label-md xl:col-start-1 xl:row-start-2 xl:divide-y">
                {tags && (
                  <div className="py-4 xl:py-8">
                    <h2 className="text-md3-label-lg text-md3-on-surface-variant mb-2 tracking-wide uppercase">
                      Tags
                    </h2>
                    <div className="flex flex-wrap">
                      {tags.map((tag) => (
                        <Tag key={tag} text={tag} />
                      ))}
                    </div>
                  </div>
                )}
                {(next || prev) && (
                  <div className="flex justify-between py-4 xl:block xl:space-y-8 xl:py-8">
                    {prev && prev.path && (
                      <div>
                        <h2 className="text-md3-label-lg text-md3-on-surface-variant mb-1 tracking-wide uppercase">
                          Previous Article
                        </h2>
                        <div className="text-md3-primary text-md3-body-lg hover:underline">
                          <Link href={`/${prev.path}`}>{prev.title}</Link>
                        </div>
                      </div>
                    )}
                    {next && next.path && (
                      <div>
                        <h2 className="text-md3-label-lg text-md3-on-surface-variant mb-1 tracking-wide uppercase">
                          Next Article
                        </h2>
                        <div className="text-md3-primary text-md3-body-lg hover:underline">
                          <Link href={`/${next.path}`}>{next.title}</Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="pt-4 xl:pt-8">
                <Link
                  href={`/${basePath}`}
                  className="text-md3-primary text-md3-label-lg hover:underline"
                  aria-label="Back to the blog"
                >
                  &larr; Back to the blog
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </article>
    </SectionContainer>
  )
}
