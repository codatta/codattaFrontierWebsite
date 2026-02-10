import { BrowserRouter, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

import { trackPageView } from './utils/track'
import GlobalModalHost from './components/app/global-modal-host'

import {
  appRoutes,
  arenaRoutes,
  accountRoutes,
  referralRoutes,
  datasetRoutes,
  frontierLayoutRoutes,
  frontierProjectRoutes,
  devRoutes,
  notFoundRoute
} from './router/routes'

export default function Router() {
  return (
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        {appRoutes}
        {accountRoutes}
        {referralRoutes}
        {arenaRoutes}
        {datasetRoutes}

        {frontierLayoutRoutes}
        {frontierProjectRoutes}

        {devRoutes}

        {notFoundRoute}
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

// http://localhost:5175/app/frontier/project/PHYSICAL_TPL_QUESTION/8995881856000103187
