import { allBlogs, type Blog } from 'contentlayer/generated'

const isProduction = process.env.NODE_ENV === 'production'

/** Returns blog posts, filtering out `draft: true` in production builds.
 *  In development all posts are visible (with a DRAFT badge in the UI). */
export function activeBlogs(): Blog[] {
  return isProduction ? allBlogs.filter((post) => !post.draft) : [...allBlogs]
}
