import { Route, BrowserRouter, Routes } from 'react-router-dom'
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
const CryptoValidationList = lazy(
  () => import('@/views/crypto/validation-list')
)

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/frontier">
          <Route path="crypto" element={<AppLayout />}>
            <Route index element={<CryptoHome />} />
            <Route path="validation/list" element={<CryptoValidationList />} />
          </Route>

          <Route path="robotics" element={<RoboticsLayout />}>
            <Route
              path="ROBOTICS_TPL_000001/:taskId"
              element={<FormType1 templateId="ROBOTICS_TPL_000001" />}
            />
            <Route
              path="ROBOTICS_TPL_000002/:taskId"
              element={<FormType2 templateId="ROBOTICS_TPL_000002" />}
            />
            <Route
              path="ROBOTICS_TPL_000003/:taskId"
              element={<FormType3 templateId="ROBOTICS_TPL_000003" />}
            />
          </Route>
        </Route>

        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="/settings" element={<SettingsLayout />}>
            <Route path="account" element={<SettingAccount />} />
            <Route path="reward" element={<SettingReward />} />
            <Route path="reputation" element={<SettingReputation />} />
          </Route>
        </Route>

        <Route path="/account">
          <Route path="signin" element={<AccountSignin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
