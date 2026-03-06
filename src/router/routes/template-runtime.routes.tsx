import { Route } from 'react-router-dom'
import { lazy } from 'react'

const TemplateRuntime = lazy(() => import('@/views/template/template-runtime'))

export const templateRuntimeRoutes = (
  <Route path="/frontier/project/:templateId/:taskId" element={<TemplateRuntime />} />
)
