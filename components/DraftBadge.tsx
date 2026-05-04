interface Props {
  draft?: boolean
}

/** Renders a small DRAFT badge if the post is marked as draft.
 *  In production builds drafts are filtered out entirely (this never renders),
 *  but in dev it surfaces unpublished posts at a glance. */
export default function DraftBadge({ draft }: Props) {
  if (!draft) return null
  return (
    <span className="bg-md3-error-container text-md3-on-error-container text-md3-label-sm rounded-md3-sm inline-flex h-6 items-center px-2 align-middle font-semibold tracking-wide uppercase">
      Draft
    </span>
  )
}
