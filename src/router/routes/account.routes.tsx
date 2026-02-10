import { Route } from 'react-router-dom'
import { lazy } from 'react'

const AccountSignin = lazy(() => import('@/views/account/signin'))
const ExtensionSignin = lazy(() => import('@/views/account/extension-signin'))
const SocialLinkLanding = lazy(() => import('@/views/account/social-link-landing'))
const ReferralLanding = lazy(() => import('@/views/referral-landing'))
const AppShareLanding = lazy(() => import('@/views/account/app-share-landing'))

export const accountRoutes = (
  <Route path="/account">
    <Route path="signin" element={<AccountSignin />} />
    <Route path="extension/signin" element={<ExtensionSignin />} />
    <Route path="social/link/:social_media" element={<SocialLinkLanding />} />
  </Route>
)

export const referralRoutes = (
  <Route path="/referral">
    <Route path="app/:code" element={<AppShareLanding />} />
    <Route path=":code" element={<ReferralLanding />} />
  </Route>
)
