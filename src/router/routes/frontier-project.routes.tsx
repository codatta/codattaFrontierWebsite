import { Route } from 'react-router-dom'
import { lazy } from 'react'

// --- App templates ---
const FashionValidationApp = lazy(() => import('@/views/frontiers/fashion_validation_app'))
const FashionGuideToDownloadApp = lazy(() => import('@/views/frontiers/fashion_guide_to_download_app'))
const AirdropFoodApp = lazy(() => import('@/views/frontiers/food-annotation-app'))
const AirdropKnobApp = lazy(() => import('@/views/frontiers/airdrop_knob_app'))
const RealWorldPhotoCollectionApp = lazy(() => import('@/views/frontiers/real_world_photo_collection_app'))
const FateApp = lazy(() => import('@/views/frontiers/fate-app'))

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LazyComponent = React.LazyExoticComponent<React.ComponentType<any>>

function appRoute(templateId: string, Component: LazyComponent) {
  return (
    <Route path={`/frontier/project/${templateId}/:taskId`}>
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
    {appRoute('FASHION_VALIDATION', FashionValidationApp)}
    {appRoute('FASHION_GUIDE_TO_DOWNLOAD', FashionGuideToDownloadApp)}
    {appRoute('AIRDROP_FOOD', AirdropFoodApp)}
    {appRoute('AIRDROP_KNOB', AirdropKnobApp)}
    {appRoute('REAL_WORLD_PHOTO_COLLECTION', RealWorldPhotoCollectionApp)}

    {/* App-only templates */}
    <Route path="/frontier/project/AIRDROP_FOOD_APP/:taskId">
      <Route index element={<AirdropFoodApp templateId="AIRDROP_FOOD_APP" />} />
      <Route path="feed/:uid" element={<AirdropFoodApp templateId="AIRDROP_FOOD_APP" isFeed={true} />} />
    </Route>

    {/* Fate App */}
    <Route path="/frontier/project/FATE_APP/:taskId" element={<FateApp templateId="FATE_APP" />} />
  </>
)

export const frontierLayoutRoutes = null
