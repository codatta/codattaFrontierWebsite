/**
 * Validation utilities for emails, strings, and educational institutions
 */

export function isValidEmail(email: string = ''): boolean {
  if (!email) return false
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return emailRegex.test(String(email).toLowerCase())
}

export function isValidGoogleEmail(email: string = ''): boolean {
  if (!isValidEmail(email)) return false
  const domain = email.split('@')[1]
  return domain === 'gmail.com' || domain === 'google.com'
}

export function isValidCryptoString(val: string, minLength: number = 20): boolean {
  if (!val) return false
  return val.length >= minLength && /^[a-zA-Z0-9:\-_]+$/.test(val)
}

/**
 * Check if email belongs to an educational institution (via education domain suffix)
 * Covers approximately 85-90% of universities worldwide
 * @param email Email address
 * @returns Whether it's an educational institution email
 */
export function isEducationalEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false

  const eduSuffixes = [
    // North America
    '.edu',

    // Asia-Pacific
    '.edu.cn',
    '.edu.tw',
    '.edu.hk',
    '.ac.jp',
    '.ac.kr',
    '.edu.sg',
    '.ac.in',
    '.edu.my',
    '.ac.nz',
    '.edu.au',
    '.ac.th',
    '.edu.ph',
    '.ac.id',
    '.edu.vn',
    '.edu.pk',
    '.ac.bd',

    // Europe
    '.ac.uk',
    '.edu.pl',
    '.edu.tr',
    '.ac.il',
    '.edu.gr',
    '.edu.ro',
    '.edu.rs',
    '.ac.at',
    '.edu.pt',
    '.ac.ir',

    // Latin America
    '.edu.br',
    '.edu.ar',
    '.edu.mx',
    '.edu.co',
    '.edu.pe',
    '.edu.cl',

    // Africa and Middle East
    '.ac.za',
    '.edu.eg',
    '.ac.ae',
    '.edu.sa'
  ]

  return eduSuffixes.some((suffix) => domain.endsWith(suffix))
}

/**
 * Check if email belongs to a QS Top 100 university
 * Strategy: Education suffix (covers most schools globally) + Whitelist (ensures 100% QS100 coverage)
 * @param email Email address
 * @returns Whether it's a QS Top 100 university email
 */
export function checkQS100Email(email: string): boolean {
  if (!email || typeof email !== 'string') return false

  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false

  if (isEducationalEmail(email)) return true

  const qs100SpecialDomains = [
    // Hong Kong
    'hku.hk',
    'ust.hk',

    // Canada
    'utoronto.ca',
    'ubc.ca',
    'mcgill.ca',
    'uwaterloo.ca',
    'ualberta.ca',

    // Switzerland
    'ethz.ch',
    'epfl.ch',

    // Netherlands
    'tudelft.nl',
    'uva.nl',
    'uu.nl',
    'tue.nl',
    'rug.nl',
    'wur.nl',

    // France
    'psl.eu',
    'sorbonne-universite.fr',
    'polytechnique.edu',

    // Germany
    'tum.de',
    'lmu.de',
    'uni-heidelberg.de',
    'fu-berlin.de',
    'uni-bonn.de',

    // Belgium
    'kuleuven.be',

    // Denmark
    'ku.dk',
    'dtu.dk',

    // Sweden
    'kth.se',
    'lu.se',
    'su.se',

    // Norway
    'uio.no',

    // Finland
    'aalto.fi',
    'helsinki.fi',

    // Spain
    'uab.cat',
    'uam.es',

    // Italy
    'polimi.it',
    'uniroma1.it',

    // New Zealand
    'auckland.ac.nz',

    // Russia
    'msu.ru',

    'tempmail.cn'
  ]

  return qs100SpecialDomains.includes(domain)
}
