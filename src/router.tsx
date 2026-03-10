import { BrowserRouter, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { trackPageView } from '@/utils/analytics'

import {
  DatasetRoutes,
  FrontierRoutes,
  SettingsRoutes,
  ReferralRoutes,
  DevRoutes,
  NotFoundRoute
} from './router/routes'

export default function Router() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        {FrontierRoutes()}
        {ReferralRoutes()}
        {SettingsRoutes()}
        {DatasetRoutes()}
        {NotFoundRoute()}
        {DevRoutes()}
      </Routes>
    </BrowserRouter>
  )
}

function RouteTracker() {
  const location = useLocation()

  useEffect(() => {
    console.log('trackPageView', location.pathname)
    trackPageView(location.pathname)
  }, [location])

  return null
}

// http://localhost:5175/m/frontier/project/PHYSICAL_TPL_QUESTION/8995881856000103187
