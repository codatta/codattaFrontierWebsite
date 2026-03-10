import { Route } from 'react-router-dom'
import { lazy } from 'react'

const BridgeTest = lazy(() => import('@/views/dev/bridge-test'))
const DevSignin = lazy(() => import('@/views/dev/signin'))
const NotFoundPage = lazy(() => import('@/views/not-found'))

export const devRoutes = (
  <Route path="/dev">
    <Route path="bridge-test" element={<BridgeTest />} />
    <Route path="signin" element={<DevSignin />} />
  </Route>
)

export const notFoundRoute = <Route path="*" element={<NotFoundPage />} />
