import { Route, BrowserRouter, Routes } from 'react-router-dom'
import AppLayout from '@/layouts/app-layout'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
