import { Route } from 'react-router-dom'
import { lazy } from 'react'

// --- Mobile ---
const ReferralApp = lazy(() => import('@/views/referral-app'))

// --- App-only routes ---
const UserInfoReputationApp = lazy(() => import('@/views/userinfo/reputation-app'))
const UserInfoDataProfileApp = lazy(() => import('@/views/userinfo/app-data-profile'))
const UserInfoDataProfileAppDetail = lazy(() => import('@/views/userinfo/app-data-profile-detail'))
const OnChainDataVerify = lazy(() => import('@/views/on-chain/onchain-data-verify'))
const SubmissionDetail = lazy(() => import('@/views/frontiers/submission-detail'))
const AppQuestChanllenge = lazy(() => import('@/views/quest/quest-challenge'))

export const appRoutes = (
  <>
    {/* Mobile routes */}
    <Route path="/m">
      <Route path="referral" element={<ReferralApp />} />
    </Route>

    {/* App routes outside AppLayout */}
    <Route path="/app/quest/:id/challenge" element={<AppQuestChanllenge />} />
    <Route path="/app/submission/:submission_id/detail" element={<SubmissionDetail />} />
    <Route path="/app/settings/data-profile/app" element={<UserInfoDataProfileApp />} />
    <Route path="/app/settings/data-profile/app/detail" element={<UserInfoDataProfileAppDetail />} />
    <Route path="/app/settings/data-profile/onchain-data-verify" element={<OnChainDataVerify />} />
    <Route path="/app/settings/reputation/app" element={<UserInfoReputationApp />} />
  </>
)
