export const VITE_IS_LOCAL = import.meta.env.DEV
export const VITE_MODE = import.meta.env.MODE
export const VITE_GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID
export const VITE_SENTRY_URL =
  'https://246a3c3dd39b2f7b32dfa4b3db18a223@o4506974851366912.ingest.us.sentry.io/4506974929485824'

export const VALIDATION_TIPS = {
  decision: 'Please choose your solid decision carefully. Too many wrong decisions may impact your reputation.',
  opinion: "If you haven't made a solid decision yet, feel free to express your opinion.",
  reason:
    'Reasons for making a reject judgment: There are multiple default options. If the reason is not among them, you can choose "Others" to fill in.',
  catetory:
    'This field provides information about any common characteristics that a particular group of labelled addresses share with each other. ',
  entity:
    "The 'Entity' field, together with the 'Network' fields, contains the actual label information for a given address. It provides information about whether a given address belongs to a specific entity.",
  txHash: 'The TxHash should be directly associated with the submitted address',
  link: 'Include social media links, news updates, and similar resources',
  existingData: 'Data tags already present in the codatta database',
  detail: 'Hovering over the entry title will display a description of the entry.'
}
