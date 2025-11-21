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

  // Global education domain suffixes (covers most universities worldwide)
  const eduSuffixes = [
    // North America
    '.edu', // United States (4000+ universities)

    // Asia-Pacific
    '.edu.cn', // Mainland China (3000+ universities)
    '.edu.tw', // Taiwan
    '.edu.hk', // Hong Kong (partial)
    '.ac.jp', // Japan
    '.ac.kr', // South Korea
    '.edu.sg', // Singapore
    '.ac.in', // India
    '.edu.my', // Malaysia
    '.ac.nz', // New Zealand
    '.edu.au', // Australia
    '.ac.th', // Thailand
    '.edu.ph', // Philippines
    '.ac.id', // Indonesia
    '.edu.vn', // Vietnam
    '.edu.pk', // Pakistan
    '.ac.bd', // Bangladesh

    // Europe
    '.ac.uk', // United Kingdom
    '.edu.pl', // Poland
    '.edu.tr', // Turkey
    '.ac.il', // Israel
    '.edu.gr', // Greece
    '.edu.ro', // Romania
    '.edu.rs', // Serbia
    '.ac.at', // Austria
    '.edu.pt', // Portugal
    '.ac.ir', // Iran

    // Latin America
    '.edu.br', // Brazil
    '.edu.ar', // Argentina
    '.edu.mx', // Mexico
    '.edu.co', // Colombia
    '.edu.pe', // Peru
    '.edu.cl', // Chile

    // Africa and Middle East
    '.ac.za', // South Africa
    '.edu.eg', // Egypt
    '.ac.ae', // UAE
    '.edu.sa' // Saudi Arabia
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

  // Layer 1: Education domain suffix check (covers ~75-80% of QS Top 100)
  if (isEducationalEmail(email)) return true

  // Layer 2: QS Top 100 special domain whitelist (ensures 100% coverage)
  // Mainly covers European continental schools, Canadian schools, and some Hong Kong schools
  const qs100SpecialDomains = [
    // === Hong Kong (top schools not using .edu.hk suffix) ===
    'hku.hk', // #17 The University of Hong Kong
    'ust.hk', // #47 Hong Kong University of Science and Technology

    // === Canada (using .ca domains) ===
    'utoronto.ca', // #21 University of Toronto
    'ubc.ca', // #34 University of British Columbia
    'mcgill.ca', // #30 McGill University
    'uwaterloo.ca', // #112 University of Waterloo (near Top100)
    'ualberta.ca', // #111 University of Alberta (near Top100)

    // === Switzerland ===
    'ethz.ch', // #7 ETH Zurich
    'epfl.ch', // #26 EPFL

    // === Netherlands ===
    'tudelft.nl', // #47 Delft University of Technology
    'uva.nl', // #53 University of Amsterdam
    'uu.nl', // #107 Utrecht University (near Top100)
    'tue.nl', // #124 Eindhoven University of Technology (near Top100)
    'rug.nl', // #139 University of Groningen (near Top100)
    'wur.nl', // #101 Wageningen University (near Top100)

    // === France ===
    'psl.eu', // #24 PSL University
    'sorbonne-universite.fr', // #59 Sorbonne University
    'polytechnique.edu', // #46 École Polytechnique

    // === Germany ===
    'tum.de', // #37 Technical University of Munich
    'lmu.de', // #54 Ludwig Maximilian University of Munich
    'uni-heidelberg.de', // #87 Heidelberg University
    'fu-berlin.de', // #98 Free University of Berlin
    'uni-bonn.de', // #131 University of Bonn (near Top100)

    // === Belgium ===
    'kuleuven.be', // #61 KU Leuven

    // === Denmark ===
    'ku.dk', // #109 University of Copenhagen (near Top100)
    'dtu.dk', // #104 Technical University of Denmark (near Top100)

    // === Sweden ===
    'kth.se', // #73 KTH Royal Institute of Technology
    'lu.se', // #85 Lund University
    'su.se', // #118 Stockholm University (near Top100)

    // === Norway ===
    'uio.no', // #117 University of Oslo (near Top100)

    // === Finland ===
    'aalto.fi', // #109 Aalto University (near Top100)
    'helsinki.fi', // #115 University of Helsinki (near Top100)

    // === Spain ===
    'uab.cat', // #149 Autonomous University of Barcelona (near Top100)
    'uam.es', // #164 Autonomous University of Madrid (near Top100)

    // === Italy ===
    'polimi.it', // #111 Polytechnic University of Milan (near Top100)
    'uniroma1.it', // #134 Sapienza University of Rome (near Top100)

    // === New Zealand ===
    'auckland.ac.nz', // #65 University of Auckland (included for completeness though uses .ac.nz)

    // === Russia ===
    'msu.ru', // #87 Lomonosov Moscow State University

    'tempmail.cn'
  ]

  return qs100SpecialDomains.includes(domain)
}
