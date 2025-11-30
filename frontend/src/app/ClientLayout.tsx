'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ToastContainer } from '@/components/ui/Toast'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isGestaoPage = pathname?.startsWith('/gestao')

  // Suppress Jitsi audio sink errors (harmless browser security restriction)
  useEffect(() => {
    const originalError = console.error
    const originalWarn = console.warn

    // Filter out Jitsi audio sink errors and Daily.co postMessage errors
    const errorHandler = (...args: any[]) => {
      const errorMessage = args.join(' ')
      // Suppress "A user gesture is required" errors from Jitsi's audio sink selection
      if (
        errorMessage.includes('NotAllowedError') &&
        errorMessage.includes('user gesture is required') &&
        (errorMessage.includes('AbstractAudio') || errorMessage.includes('setting sink'))
      ) {
        // Silently ignore these errors - they're harmless browser security restrictions
        return
      }
      // Suppress Daily.co postMessage errors (can occur during frame creation but frame may still work)
      if (
        errorMessage.includes('postMessage') &&
        errorMessage.includes('null is not an object')
      ) {
        // Silently ignore these errors - they may be non-critical
        return
      }
      originalError.apply(console, args)
    }

    const warnHandler = (...args: any[]) => {
      const warnMessage = args.join(' ')
      // Suppress related warnings
      if (
        warnMessage.includes('Error setting sink') ||
        (warnMessage.includes('NotAllowedError') && warnMessage.includes('user gesture'))
      ) {
        return
      }
      originalWarn.apply(console, args)
    }

    // Override console methods
    console.error = errorHandler
    console.warn = warnHandler

    // Also catch unhandled promise rejections
    const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
      const error = event.reason
      if (
        error?.name === 'NotAllowedError' &&
        (error?.message?.includes('user gesture is required') ||
          error?.stack?.includes('AbstractAudio') ||
          error?.stack?.includes('setSinkId'))
      ) {
        event.preventDefault()
        return
      }
      // Suppress Daily.co postMessage errors in unhandled rejections
      if (
        error?.message?.includes('postMessage') &&
        error?.message?.includes('null is not an object')
      ) {
        event.preventDefault()
        return
      }
    }

    window.addEventListener('unhandledrejection', unhandledRejectionHandler)

    return () => {
      // Restore original console methods
      console.error = originalError
      console.warn = originalWarn
      window.removeEventListener('unhandledrejection', unhandledRejectionHandler)
    }
  }, [])

  return (
    <>
      {!isGestaoPage && <Navbar />}
      <main>{children}</main>
      {!isGestaoPage && <Footer />}
      <ToastContainer />
    </>
  )
}

