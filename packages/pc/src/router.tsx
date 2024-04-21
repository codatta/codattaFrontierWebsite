import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom'

import Layout from '@/components/Layout'

const config = createRoutesFromElements(
  <>
    <Route path="/" element={<Layout />}>
      <Route path="" lazy={() => import('@/views/Home.tsx')} />
      <Route path="board" lazy={() => import('@/views/Board.tsx')} />
    </Route>
    <Route path="*" lazy={() => import('@/views/Home.tsx')} />
  </>
)

const router = createBrowserRouter(config)
export default router
