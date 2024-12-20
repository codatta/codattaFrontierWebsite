import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
import { lazy } from 'react'

import RoboticsLayout from '@/layouts/robotics-layout'
import SettingsLayout from '@/layouts/settings-layout'
import AppLayout from '@/layouts/app-layout'

const FormType1 = lazy(() => import('@/views/robotics/form-type-1'))
const FormType2 = lazy(() => import('@/views/robotics/form-type-2'))
const FormType3 = lazy(() => import('@/views/robotics/form-type-3'))

const SettingAccount = lazy(() => import('@/views/settings/account'))
const SettingReward = lazy(() => import('@/views/settings/reward'))
const SettingReputation = lazy(() => import('@/views/settings/reputation'))

const ActivityGroup = lazy(() => import('@/views/quest/activity-group'))
const Activity = lazy(() => import('@/views/quest/activity'))

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/frontier">
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

        <Route Component={AppLayout}>
          <Route path="/settings" element={<SettingsLayout />}>
            <Route path="" element={<Navigate to="account" replace />} />
            <Route path="account" element={<SettingAccount />} />
            <Route path="reward" element={<SettingReward />} />
            <Route path="reputation" element={<SettingReputation />} />
          </Route>
          <Route path="/quest">
            <Route path="" element={<ActivityGroup />} />
            <Route path=":categoryId" element={<Activity />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
