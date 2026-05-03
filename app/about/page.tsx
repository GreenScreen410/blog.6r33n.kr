import { Authors, allAuthors } from 'contentlayer/generated'
import { MDXLayoutRenderer } from 'pliny/mdx-components'
import AuthorLayout from '@/layouts/AuthorLayout'
import GithubReadme from '@/components/GithubReadme'
import { coreContent } from 'pliny/utils/contentlayer'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'About' })

// Refresh GitHub README content hourly without rebuild.
export const revalidate = 3600

function extractGithubUsername(url?: string): string | null {
  if (!url) return null
  const match = url.match(/github\.com\/([^/?#]+)/)
  return match ? match[1] : null
}

export default async function Page() {
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const mainContent = coreContent(author)
  const username = extractGithubUsername(mainContent.github)

  return (
    <AuthorLayout content={mainContent}>
      <MDXLayoutRenderer code={author.body.code} />
      {username && <GithubReadme username={username} />}
    </AuthorLayout>
  )
}
