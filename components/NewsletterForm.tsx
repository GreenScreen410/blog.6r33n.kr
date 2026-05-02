'use client'

import { useRef, useState } from 'react'

interface NewsletterFormProps {
  title?: string
  apiUrl?: string
}

const NewsletterForm = ({
  title = 'Subscribe to the newsletter',
  apiUrl = '/api/newsletter',
}: NewsletterFormProps) => {
  const inputEl = useRef<HTMLInputElement>(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(apiUrl, {
      body: JSON.stringify({ email: inputEl.current?.value }),
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    })
    const { error: error2 } = await res.json()
    if (error2) {
      setError(true)
      setMessage('Your e-mail address is invalid or you are already subscribed!')
      return
    }
    if (inputEl.current) inputEl.current.value = ''
    setError(false)
    setSubscribed(true)
    setMessage('Successfully! 🎉 You are now subscribed.')
  }

  return (
    <div>
      <div className="text-md3-title-md text-md3-on-surface pb-2">{title}</div>
      <form className="flex flex-col gap-3 sm:flex-row sm:items-center" onSubmit={subscribe}>
        <label htmlFor="email-input" className="flex-1">
          <span className="sr-only">Email address</span>
          <input
            autoComplete="email"
            className="border-md3-outline focus:border-md3-primary focus:ring-md3-primary bg-md3-surface-container-low text-md3-on-surface placeholder:text-md3-on-surface-variant rounded-md3-xs text-md3-body-lg block h-14 w-full border px-4 transition-colors focus:ring-1 focus:outline-none disabled:opacity-50 sm:w-72"
            id="email-input"
            name="email"
            placeholder={subscribed ? "You're subscribed! 🎉" : 'Enter your email'}
            ref={inputEl}
            required
            type="email"
            disabled={subscribed}
          />
        </label>
        <button
          className={`bg-md3-primary text-md3-on-primary text-md3-label-lg rounded-md3-full ease-md3-standard h-10 px-6 transition-shadow ${
            subscribed
              ? 'cursor-default opacity-60'
              : 'hover:shadow-md3-1 focus:shadow-md3-1 focus:outline-none'
          }`}
          type="submit"
          disabled={subscribed}
        >
          {subscribed ? 'Thank you!' : 'Sign up'}
        </button>
      </form>
      {error && (
        <div className="text-md3-error text-md3-body-sm pt-2" role="alert">
          {message}
        </div>
      )}
    </div>
  )
}

export default NewsletterForm
