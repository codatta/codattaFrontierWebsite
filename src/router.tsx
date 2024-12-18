import { Route, BrowserRouter, Routes } from 'react-router-dom'
import { lazy } from 'react'

import RoboticsLayout from '@/layouts/robotics-layout'

const FormType1 = lazy(() => import('@/views/robotics/form-type-1'))
const FormType2 = lazy(() => import('@/views/robotics/form-type-2'))
const FormType3 = lazy(() => import('@/views/robotics/form-type-3'))

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
      </Routes>
    </BrowserRouter>
  )
}
