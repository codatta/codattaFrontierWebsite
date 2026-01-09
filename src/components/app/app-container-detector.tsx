import { ReactNode, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

interface InAppProps {
  isFeed: boolean
}

interface AppContainerDetectorProps {
  /**
   * Content to render when running inside the Codatta app
   */
  inApp?: ReactNode | ((props: InAppProps) => ReactNode)
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
  const location = useLocation()
  const isInApp = useMemo(() => {
    // location.hash is used for local development to mock app container
    const userAgent = (customUserAgent || navigator.userAgent).toLowerCase()
    return userAgent.includes('codatta') || location.hash?.toLowerCase().includes('codatta')
  }, [customUserAgent, location.hash])

  // const isFeed = useMemo(() => {
  //   return location.search.includes('feed=1')
  // }, [location.search])

  if (isInApp) {
    // if (typeof inApp === 'function') {
    //   return <>{inApp({ isFeed })}</>
    // }
    return <>{inApp}</>
  }

  return <>{notInApp}</>
}
