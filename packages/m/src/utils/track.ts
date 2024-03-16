function gtag(...args) {
  // @ts-ignore
  if (window.dtaLayer) {
    // @ts-ignore
    window.dataLayer.push(args)
  }
}

export function trackClickEvent(eventCategory: string, eventLabel: string) {
  gtag('event', 'click', {
    event_category: eventCategory,
    event_label: eventLabel,
  })
}
