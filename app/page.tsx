import { sortPosts, allCoreContent, coreContent } from 'pliny/utils/contentlayer'
import { allBlogs, allAuthors, type Authors } from 'contentlayer/generated'
import Main from './Main'

export default async function Page() {
  const sortedPosts = sortPosts(allBlogs)
  const posts = allCoreContent(sortedPosts)
  const author = allAuthors.find((p) => p.slug === 'default') as Authors
  const authorContent = coreContent(author)
  return <Main posts={posts} author={authorContent} />
}
