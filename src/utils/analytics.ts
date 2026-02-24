/**
 * Google Analytics tracking utilities
 */

import ReactGA from 'react-ga4'

import { VITE_GA_TRACKING_ID } from '@/config/config'

export function initGA() {
  ReactGA.initialize([
    {
      trackingId: VITE_GA_TRACKING_ID,
      gaOptions: {
        userId: localStorage.getItem('uid') || undefined
      }
    }
  ])
}

export function trackPageView(pageName: string) {
  ReactGA.send({ hitType: 'pageview', page: pageName })
}

type TTrackEventOptions = {
  method?: string
  contentType?: string
  extra?: Record<string, unknown>
}

export function trackEvent(eventCategory: string, params?: Partial<TTrackEventOptions>) {
  if (params) {
    const { method, contentType, extra } = params
    ReactGA.event(eventCategory, {
      method,
      content_type: contentType,
      customParams: JSON.stringify(extra)
    })
  } else {
    ReactGA.event(eventCategory)
  }
}

export const TRACK_CATEGORY = {
  NAV_CLICK: 'nav-click',
  LINK_CLICK: 'link-click',
  BTN_CLICK: 'btn-click',
  SUBMIT_CLICK: 'submit-click'
}
