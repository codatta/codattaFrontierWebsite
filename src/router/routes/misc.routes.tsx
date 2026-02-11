import { Route } from 'react-router-dom'
import { lazy } from 'react'

const BridgeTest = lazy(() => import('@/views/dev/bridge-test'))
const NotFoundPage = lazy(() => import('@/views/not-found'))

export const devRoutes = <Route path="/dev/bridge-test" element={<BridgeTest />} />

export const notFoundRoute = <Route path="*" element={<NotFoundPage />} />
