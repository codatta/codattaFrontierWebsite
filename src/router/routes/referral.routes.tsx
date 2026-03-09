import { Route } from 'react-router-dom'
import { lazy } from 'react'

const Referral = lazy(() => import('@/views/referral/referral'))
const Landing = lazy(() => import('@/views/referral/landing'))

export const referralRoutes = (
  <Route path="/m/referral">
    <Route index element={<Referral />} />
    <Route path=":code" element={<Landing />} />
  </Route>
)
