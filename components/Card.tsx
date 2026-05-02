import Image from './Image'
import Link from './Link'

const Card = ({ title, description, imgSrc, href }) => (
  <div className="md max-w-[544px] p-4 md:w-1/2">
    <div
      className={`${imgSrc && 'h-full'} bg-md3-surface-container-low rounded-md3-md shadow-md3-1 hover:shadow-md3-2 ease-md3-standard overflow-hidden transition-shadow duration-200`}
    >
      {imgSrc &&
        (href ? (
          <Link href={href} aria-label={`Link to ${title}`}>
            <Image
              alt={title}
              src={imgSrc}
              className="object-cover object-center md:h-36 lg:h-48"
              width={544}
              height={306}
            />
          </Link>
        ) : (
          <Image
            alt={title}
            src={imgSrc}
            className="object-cover object-center md:h-36 lg:h-48"
            width={544}
            height={306}
          />
        ))}
      <div className="p-6">
        <h2 className="text-md3-title-lg text-md3-on-surface mb-3">
          {href ? (
            <Link href={href} aria-label={`Link to ${title}`}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h2>
        <p className="text-md3-body-md text-md3-on-surface-variant prose mb-4 max-w-none">
          {description}
        </p>
        {href && (
          <Link
            href={href}
            className="text-md3-primary hover:bg-md3-primary-container rounded-md3-full text-md3-label-lg -mx-3 inline-flex h-9 items-center px-3 transition-colors"
            aria-label={`Link to ${title}`}
          >
            Learn more &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
)

export default Card
