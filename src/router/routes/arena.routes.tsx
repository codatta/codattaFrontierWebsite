import { Route } from 'react-router-dom'
import { lazy } from 'react'

import ArenaLayout from '@/layouts/arena-layout'

const ChatbotArenaPage = lazy(() => import('@/views/arena'))
const ModelListPage = lazy(() => import('@/views/arena/model-list'))
const ChatBotArenaLeaderboardPage = lazy(() => import('@/views/arena/leaderboard'))
const ArenaOnChainList = lazy(() => import('@/views/arena/onchain-record'))

export const arenaRoutes = (
  <Route path="/arena" element={<ArenaLayout />}>
    <Route index element={<ChatbotArenaPage />} />
    <Route path="leaderboard" element={<ChatBotArenaLeaderboardPage />} />
    <Route path="model/list" element={<ModelListPage />} />
    <Route path="onchain/list" element={<ArenaOnChainList />} />
  </Route>
)
