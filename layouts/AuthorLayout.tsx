import { ReactNode } from 'react'
import type { Authors } from 'contentlayer/generated'
import SocialIcon from '@/components/social-icons'
import Image from '@/components/Image'
import Link from '@/components/Link'

interface Props {
  children: ReactNode
  content: Omit<Authors, '_id' | '_raw' | 'body'>
}

export default function AuthorLayout({ children, content }: Props) {
  const { name, avatar, occupation, company, email, twitter, bluesky, linkedin, github } = content

  return (
    <div className="pt-8 pb-16">
      <header className="mb-10 space-y-3">
        <h1 className="text-md3-headline-lg sm:text-md3-display-sm md:text-md3-display-md text-md3-on-surface tracking-tight">
          About
        </h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
        {/* ─────────── Profile card ─────────── */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="bg-md3-surface-container-low rounded-md3-lg shadow-md3-1 relative overflow-hidden p-8">
            <div
              aria-hidden
              className="bg-md3-primary-container pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full opacity-50 blur-2xl"
            />
            <div className="relative flex flex-col items-center text-center">
              {avatar && (
                <div className="bg-md3-primary-container ring-md3-primary/20 rounded-full p-1.5 ring-2">
                  <Image
                    src={avatar}
                    alt={name}
                    width={160}
                    height={160}
                    className="h-40 w-40 rounded-full"
                  />
                </div>
              )}
              <h2 className="text-md3-headline-sm text-md3-on-surface mt-5 tracking-tight">
                {name}
              </h2>
              {occupation && (
                <p className="text-md3-body-md text-md3-on-surface-variant mt-2">{occupation}</p>
              )}
              {company && <p className="text-md3-body-md text-md3-on-surface-variant">{company}</p>}

              {email && (
                <Link
                  href={`mailto:${email}`}
                  className="text-md3-on-secondary-container bg-md3-secondary-container hover:shadow-md3-1 ease-md3-standard rounded-md3-full text-md3-label-lg mt-6 inline-flex h-10 items-center px-5 transition-shadow"
                >
                  {email}
                </Link>
              )}

              <div className="text-md3-on-surface-variant mt-5 flex flex-wrap justify-center gap-1">
                {github && (
                  <SocialButton>
                    <SocialIcon kind="github" href={github} size={5} />
                  </SocialButton>
                )}
                {linkedin && (
                  <SocialButton>
                    <SocialIcon kind="linkedin" href={linkedin} size={5} />
                  </SocialButton>
                )}
                {twitter && (
                  <SocialButton>
                    <SocialIcon kind="x" href={twitter} size={5} />
                  </SocialButton>
                )}
                {bluesky && (
                  <SocialButton>
                    <SocialIcon kind="bluesky" href={bluesky} size={5} />
                  </SocialButton>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* ─────────── Bio / MDX content ─────────── */}
        <div className="lg:col-span-2">
          <div className="prose dark:prose-invert text-md3-body-lg max-w-none">
            {children || (
              <p className="text-md3-on-surface-variant">
                아직 자기소개가 비어있습니다. <code>data/authors/default.mdx</code> 파일에 내용을
                채워주세요.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SocialButton({ children }: { children: ReactNode }) {
  return (
    <span className="hover:bg-md3-surface-container inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors">
      {children}
    </span>
  )
}
