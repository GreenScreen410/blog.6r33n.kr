import Link from 'next/link'
import { slug } from 'github-slugger'

interface Props {
  text: string
}

const Tag = ({ text }: Props) => {
  return (
    <Link
      href={`/tags/${slug(text)}`}
      className="bg-md3-secondary-container text-md3-on-secondary-container hover:bg-md3-tertiary-container hover:text-md3-on-tertiary-container rounded-md3-sm text-md3-label-lg mr-2 mb-1 inline-flex h-8 items-center px-3 transition-colors"
    >
      {text.split(' ').join('-')}
    </Link>
  )
}

export default Tag
