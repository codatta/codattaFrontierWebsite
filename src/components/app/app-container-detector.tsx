import { ReactNode, useMemo } from 'react'

interface AppContainerDetectorProps {
  /**
   * Content to render when running inside the Codatta app
   */
  inApp?: ReactNode
  /**
   * Content to render when running in other environments (web browser, etc.)
   */
  notInApp?: ReactNode
  /**
   * Optional custom user agent string for testing purposes
   */
  customUserAgent?: string
}

export default function AppContainerDetector({ inApp, notInApp, customUserAgent }: AppContainerDetectorProps) {
  const isInApp = useMemo(() => {
    const userAgent = (customUserAgent || navigator.userAgent).toLowerCase()
    return userAgent.includes('codatta')
  }, [customUserAgent])

  return <>{isInApp ? inApp : notInApp}</>
}
