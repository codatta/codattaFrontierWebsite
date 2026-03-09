import { Route } from 'react-router-dom'
import { lazy } from 'react'

const AccountSignin = lazy(() => import('@/views/account/signin'))
const AppShareLanding = lazy(() => import('@/views/account/app-share-landing'))

export const accountRoutes = (
  <Route path="/account">
    <Route path="signin" element={<AccountSignin />} />
  </Route>
)

export const referralRoutes = (
  <Route path="/referral">
    <Route path="app/:code" element={<AppShareLanding />} />
  </Route>
)
