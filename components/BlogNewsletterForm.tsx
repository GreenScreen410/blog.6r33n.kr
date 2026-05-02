import NewsletterForm from './NewsletterForm'

interface BlogNewsletterFormProps {
  title?: string
}

const BlogNewsletterForm = ({ title }: BlogNewsletterFormProps) => (
  <div className="bg-md3-surface-container-low rounded-md3-lg my-8 p-6 sm:p-8">
    <NewsletterForm title={title} />
  </div>
)

export default BlogNewsletterForm
