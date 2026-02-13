import { Route } from 'react-router-dom'
import { lazy } from 'react'

const FoodScienceDataSet = lazy(() => import('@/views/dataset/food-science'))
const HealthcareDataSet = lazy(() => import('@/views/dataset/healthcare'))
const CryptoAddressesDataSet = lazy(() => import('@/views/dataset/crypto-addresses'))
const RoboticsDataSet = lazy(() => import('@/views/dataset/robotics'))
const KitchenApplicantsDataSet = lazy(() => import('@/views/dataset/kitchen-applicants'))
const FashionDataSet = lazy(() => import('@/views/dataset/fashion'))
const LLMFailureCasesDataSet = lazy(() => import('@/views/dataset/llm-failure-cases'))

export const datasetRoutes = (
  <Route path="dataset">
    <Route path="food-science" element={<FoodScienceDataSet />} />
    <Route path="healthcare" element={<HealthcareDataSet />} />
    <Route path="crypto-addresses" element={<CryptoAddressesDataSet />} />
    <Route path="robotics" element={<RoboticsDataSet />} />
    <Route path="kitchen-applicants" element={<KitchenApplicantsDataSet />} />
    <Route path="fashion" element={<FashionDataSet />} />
    <Route path="llm-failure-cases" element={<LLMFailureCasesDataSet />} />
  </Route>
)
