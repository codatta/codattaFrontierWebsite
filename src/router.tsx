import { Route, BrowserRouter, Routes } from 'react-router-dom'
// import { lazy } from 'react'

import AppLayout from '@/layouts/app-layout'
import HomePage from "./views/home";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
