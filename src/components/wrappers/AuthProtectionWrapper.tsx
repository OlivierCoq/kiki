'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Suspense } from 'react'

import type { ChildrenType } from '@/types/component-props'
import FallbackLoading from '../FallbackLoading'

const AuthProtectionWrapper = ({ children }: ChildrenType) => {
  const { push } = useRouter()
  const pathname = usePathname()

  if (status == 'unauthenticated') {
    push(`/login?redirectTo=${pathname}`)
    return <FallbackLoading />
  }

  return <Suspense>{children}</Suspense>
}

export default AuthProtectionWrapper
