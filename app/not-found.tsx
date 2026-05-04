import Link from '@/components/Link'

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="space-y-6">
        <p className="text-md3-display-lg text-md3-primary leading-none tracking-tight sm:text-[8rem]">
          404
        </p>
        <h1 className="text-md3-headline-md sm:text-md3-headline-lg text-md3-on-surface tracking-tight">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-md3-body-lg text-md3-on-surface-variant mx-auto max-w-md">
          링크가 잘못됐거나, 글이 삭제됐거나, 아직 작성 중일 수 있습니다.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/"
            className="bg-md3-primary text-md3-on-primary text-md3-label-lg rounded-md3-full ease-md3-standard hover:shadow-md3-1 inline-flex h-10 items-center px-6 transition-shadow"
          >
            홈으로 →
          </Link>
          <Link
            href="/blog"
            className="border-md3-outline text-md3-on-surface text-md3-label-lg rounded-md3-full hover:bg-md3-surface-container inline-flex h-10 items-center border px-6 transition-colors"
          >
            전체 글 보기
          </Link>
          <Link
            href="/tags"
            className="border-md3-outline text-md3-on-surface text-md3-label-lg rounded-md3-full hover:bg-md3-surface-container inline-flex h-10 items-center border px-6 transition-colors"
          >
            태그
          </Link>
        </div>
      </div>
    </section>
  )
}
