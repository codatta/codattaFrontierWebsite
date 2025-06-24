import ReactGA from 'react-ga4'

import { VITE_GA_TRACKING_ID } from '@/config/config'

/**
 * Initializes Google Analytics.
 */
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

/**
 * Tracks the current page view.
 */
export function trackPageView(pageName: string) {
  ReactGA.send({ hitType: 'pageview', page: pageName })
}

/**
 * Options for tracking a generic event.
 */
type TTrackEventOptions = {
  method?: string
  contentType?: string
  extra?: Record<string, unknown>
}

/**
 * Tracks a generic event.
 * @param eventCategory - The category of the event.
 * @param params - The options for the event.
 * @param params.method - The method associated with the event.
 * @param params.contentType - The content type associated with the event.
 * @param params.extra - Custom parameters associated with the event.
 */

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

/**
 * Constants for Google Analytics event categories.
 */
export const TRACK_CATEGORY = {
  NAV_CLICK: 'nav-click',
  LINK_CLICK: 'link-click',
  BTN_CLICK: 'btn-click',
  SUBMIT_CLICK: 'submit-click'
}
