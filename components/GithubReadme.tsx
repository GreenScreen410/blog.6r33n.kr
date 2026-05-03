import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface Props {
  username: string
}

/** Fetches the user's GitHub profile README and renders it.
 *  Returns null if no README is found or the request fails. */
export default async function GithubReadme({ username }: Props) {
  let markdown: string | null = null
  for (const branch of ['main', 'master']) {
    const url = `https://raw.githubusercontent.com/${username}/${username}/${branch}/README.md`
    try {
      const res = await fetch(url, { next: { revalidate: 3600 } })
      if (res.ok) {
        markdown = await res.text()
        break
      }
    } catch {
      // try next branch
    }
  }

  if (!markdown) return null

  return (
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
      {markdown}
    </ReactMarkdown>
  )
}
