import { BrowserRouter, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { trackPageView } from '@/utils/analytics'
import GlobalModalHost from './components/common/global-modal-host'

import {
  datasetRoutes,
  frontierRoutes,
  settingsRoutes,
  referralRoutes,
  devRoutes,
  notFoundRoute
} from './router/routes'

export default function Router() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        {frontierRoutes}
        {referralRoutes}
        {settingsRoutes}
        {datasetRoutes}
        {notFoundRoute}
        {devRoutes}
      </Routes>
      <GlobalModalHost />
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
