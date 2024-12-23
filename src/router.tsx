import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { lazy } from 'react'

import RoboticsLayout from '@/layouts/robotics-layout'
import SettingsLayout from '@/layouts/settings-layout'
import AppLayout from '@/layouts/app-layout'

// index home
const Home = lazy(() => import('@/views/home'))

// robotics
const FormType1 = lazy(() => import('@/views/robotics/form-type-1'))
const FormType2 = lazy(() => import('@/views/robotics/form-type-2'))
const FormType3 = lazy(() => import('@/views/robotics/form-type-3'))

// settings
const SettingAccount = lazy(() => import('@/views/settings/account'))
const SettingReward = lazy(() => import('@/views/settings/reward'))
const SettingReputation = lazy(() => import('@/views/settings/reputation'))

// account
const AccountSignin = lazy(() => import('@/views/account/signin'))

const CryptoHome = lazy(() => import('@/views/crypto/home'))
const CryptoValidationList = lazy(() => import('@/views/crypto/validation-list'))
const CryptoSubmissionSubmit = lazy(() => import('@/views/crypto/submission-submit'))
const CryptoSubmissionHistory = lazy(() => import('@/views/crypto/submission-history'))
const CryptoBountyHome = lazy(() => import('@/views/crypto/bounty-home'))
const CryptoBountyList = lazy(() => import('@/views/crypto/bounty-list'))
const CryptoBountyDetail = lazy(() => import('@/views/crypto/bounty-detail'))
const CryptoBountySubmit = lazy(() => import('@/views/crypto/bounty-submit'))

const FashionHome = lazy(() => import('@/views/fashion/home'))
const RoboticsHome = lazy(() => import('@/views/robotics/home'))

const ActivityGroup = lazy(() => import('@/views/quest/activity-group'))
const Activity = lazy(() => import('@/views/quest/activity'))

const ReferralLanding = lazy(() => import('@/views/referral-landing'))

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Navigate to="/app" />} />

        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Home />} />

          <Route path="fashion" element={<FashionHome />}></Route>
          <Route path="robotics" element={<RoboticsHome />}></Route>

          <Route path="settings" element={<SettingsLayout />}>
            <Route path="account" element={<SettingAccount />} />
            <Route path="reward" element={<SettingReward />} />
            <Route path="reputation" element={<SettingReputation />} />
          </Route>

          <Route path="crypto">
            <Route index element={<CryptoHome />} />
            <Route path="validation/list" element={<CryptoValidationList />} />
            <Route path="submission/submit" element={<CryptoSubmissionSubmit />} />
            <Route path="submission/history" element={<CryptoSubmissionHistory />} />
            <Route path="bounty" element={<CryptoBountyHome />} />
            <Route path="bounty/:id/detail" element={<CryptoBountyDetail />}></Route>
            <Route path="bounty/:id/submit" element={<CryptoBountySubmit />}></Route>
            <Route path="bounty/list" element={<CryptoBountyList />} />
          </Route>

          <Route path="quest">
            <Route path="" element={<ActivityGroup />} />
            <Route path=":categoryId" element={<Activity />} />
          </Route>
        </Route>

        <Route path="/account">
          <Route path="signin" element={<AccountSignin />} />
        </Route>

        <Route path="/referral/:code" element={<ReferralLanding />} />

        <Route path="/frontier">
          <Route path="robotics" element={<RoboticsLayout />}>
            <Route path="ROBOTICS_TPL_000001/:taskId" element={<FormType1 templateId="ROBOTICS_TPL_000001" />} />
            <Route path="ROBOTICS_TPL_000002/:taskId" element={<FormType2 templateId="ROBOTICS_TPL_000002" />} />
            <Route path="ROBOTICS_TPL_000003/:taskId" element={<FormType3 templateId="ROBOTICS_TPL_000003" />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
