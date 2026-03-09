import { Route } from 'react-router-dom'
import { lazy } from 'react'

const DataProfile = lazy(() => import('@/views/settings/data-profile'))
const DataProfileDetail = lazy(() => import('@/views/settings/data-profile-detail'))
const OnchainDataVerify = lazy(() => import('@/views/settings/onchain-data-verify'))
const Reputation = lazy(() => import('@/views/settings/reputation'))

export const settingsRoutes = (
  <>
    <Route path="/m/settings/data-profile" element={<DataProfile />} />
    <Route path="/m/settings/data-profile/detail" element={<DataProfileDetail />} />
    <Route path="/m/settings/data-profile/onchain-data-verify" element={<OnchainDataVerify />} />
    <Route path="/m/settings/reputation" element={<Reputation />} />
  </>
)
