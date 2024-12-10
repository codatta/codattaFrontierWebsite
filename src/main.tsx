import { createRoot } from 'react-dom/client'
import Router from '@/router'
// import gsap from 'gsap'
// import ScrollTrigger from 'gsap/ScrollTrigger'

import '@/styles/tailwind.css'
import '@/styles/index.css'

// gsap.registerPlugin(ScrollTrigger)

const container = document.getElementById('root')
if (!container) {
  throw new Error('root container not found')
}
const root = createRoot(container)
root.render(<Router></Router>)
