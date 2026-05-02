'use client'

import { Comments as CommentsComponent } from 'pliny/comments'
import { useState } from 'react'
import siteMetadata from '@/data/siteMetadata'

export default function Comments({ slug }: { slug: string }) {
  const [loadComments, setLoadComments] = useState(false)

  if (!siteMetadata.comments?.provider) {
    return null
  }
  return (
    <>
      {loadComments ? (
        <CommentsComponent commentsConfig={siteMetadata.comments} slug={slug} />
      ) : (
        <button
          onClick={() => setLoadComments(true)}
          className="bg-md3-secondary-container text-md3-on-secondary-container text-md3-label-lg rounded-md3-full ease-md3-standard hover:shadow-md3-1 inline-flex h-10 items-center px-6 transition-shadow"
        >
          Load Comments
        </button>
      )}
    </>
  )
}
