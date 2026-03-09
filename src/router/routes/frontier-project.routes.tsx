import { Route } from 'react-router-dom'
import { lazy } from 'react'

import SubmissionDetail from '@/views/frontier/submission-detail'
// --- Frontier task templates ---
const FashionValidationApp = lazy(() => import('@/views/frontier/fashion-validation'))
const FashionGuideToDownloadApp = lazy(() => import('@/views/frontier/fashion-guide-to-download'))
const AirdropFoodApp = lazy(() => import('@/views/frontier/food-annotation'))
const AirdropKnobApp = lazy(() => import('@/views/frontier/airdrop-knob'))
const RealWorldPhotoCollectionApp = lazy(() => import('@/views/frontier/real-world-photo-collection'))
const FateApp = lazy(() => import('@/views/frontier/fate'))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>

function appRoute(templateId: string, Component: LazyComponent) {
  return (
    <Route path={`/m/frontier/project/${templateId}/:taskId`}>
      <Route index element={<Component templateId={templateId} />} />
      <Route path="feed/:uid" element={<Component templateId={templateId} isFeed={true} />} />
    </Route>
  )
}

// ============================================================
// Exported routes
// ============================================================

/** Standalone frontier project routes (App only) */
export const frontierProjectRoutes = (
  <>
    <Route path="/m/submission/:submission_id/detail" element={<SubmissionDetail />} />
    {appRoute('FASHION_VALIDATION', FashionValidationApp)}
    {appRoute('FASHION_GUIDE_TO_DOWNLOAD', FashionGuideToDownloadApp)}
    {appRoute('AIRDROP_FOOD', AirdropFoodApp)}
    {appRoute('AIRDROP_KNOB', AirdropKnobApp)}
    {appRoute('REAL_WORLD_PHOTO_COLLECTION', RealWorldPhotoCollectionApp)}

    {appRoute('AIRDROP_FOOD_APP', AirdropFoodApp)}
    {appRoute('FATE_APP', FateApp)}
  </>
)

export const frontierLayoutRoutes = null
