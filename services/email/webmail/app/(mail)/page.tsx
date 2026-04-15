'use client'

/**
 * Root page — redirects to /folder/inbox.
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/folder/inbox')
  }, [router])
  return null
}
