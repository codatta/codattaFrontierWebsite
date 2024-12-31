const DOCS_MAP: { [key: string]: Promise<typeof import('*.md')> } = {
  // common
  'known-address': import('@/docs/category-help/known-address.md'),
  'whats-next': import('@/docs/category-help/whats-next.md'),
  'how-to-calculate': import('@/docs/category-help/how-to-calculate.md'),

  // Cryptocurrency Service
  atm: import('@/docs/category-help/atm.md'),
  'coin swapper': import('@/docs/category-help/coin-swapper.md'),
  dex: import('@/docs/category-help/dex.md'),
  exchange: import('@/docs/category-help/exchange.md'),
  'hot wallet': import('@/docs/category-help/hot-wallet.md'),
  'marketplace aggregator': import('@/docs/category-help/marketplace-aggregator.md'),
  mixer: import('@/docs/category-help/mixer.md'),
  'privacy (not mixer)': import('@/docs/category-help/privacy-not-mixer.md'),

  // NFT
  nft: import('@/docs/category-help/nft.md'),

  // DeFi
  dao: import('@/docs/category-help/dao.md'),
  'dapp, other': import('@/docs/category-help/dapp-other.md'),
  defi: import('@/docs/category-help/defi.md'),
  'factory contract': import('@/docs/category-help/factory-contract.md'),
  lending: import('@/docs/category-help/lending.md'),
  'liquid staking': import('@/docs/category-help/liquid-staking.md'),
  vault: import('@/docs/category-help/vault.md'),
  yield: import('@/docs/category-help/yield.md'),
  'yield farming': import('@/docs/category-help/yield-farming.md'),

  // Smart Contract
  'smart contract': import('@/docs/category-help/smart-contract.md'),

  // Wallet and Storage
  'cold storage': import('@/docs/category-help/cold-storage.md'),
  multisig: import('@/docs/category-help/multisig.md'),
  wallet: import('@/docs/category-help/wallet.md'),

  // Compliance and Regulation
  'constrained by service': import('@/docs/category-help/constrained-by-service.md'),
  'fake kyc': import('@/docs/category-help/fake-kyc.md'),
  kyc: import('@/docs/category-help/kyc.md'),
  'le (law enforcement)': import('@/docs/category-help/le-law-enforcement.md'),
  'no kyc': import('@/docs/category-help/no-kyc.md'),
  sanctioned: import('@/docs/category-help/sanctioned.md'),

  // Technology and Infrastructure
  bridging: import('@/docs/category-help/bridging.md'),
  'eth 2 staker': import('@/docs/category-help/eth-2-staker.md'),
  Genesis: import('@/docs/category-help/genesis.md'),
  ico: import('@/docs/category-help/ico.md'),
  infrastructure: import('@/docs/category-help/infrastructure.md'),
  // 'layer 2 extension' not find
  'mev bot': import('@/docs/category-help/mev-bot.md'),
  'mining pool': import('@/docs/category-help/mining-pool.md'),
  multichain: import('@/docs/category-help/multichain.md'),
  oracle: import('@/docs/category-help/oracle.md'),
  proxy: import('@/docs/category-help/proxy.md'),
  router: import('@/docs/category-help/router.md'),
  sidechain: import('@/docs/category-help/sidechain.md'),
  staking: import('@/docs/category-help/staking.md'),
  'token sale': import('@/docs/category-help/token-sale.md'),
  'token team': import('@/docs/category-help/token-team.md'),
  validator: import('@/docs/category-help/validator.md'),

  // Financial Service
  advertising: import('@/docs/category-help/advertising.md'),
  'asset management': import('@/docs/category-help/asset-management.md'),
  auction: import('@/docs/category-help/auction.md'),
  cex: import('@/docs/category-help/cex.md'),
  charity: import('@/docs/category-help/charity.md'),
  derivatives: import('@/docs/category-help/derivatives.md'),
  donation: import('@/docs/category-help/donation.md'),
  fiat: import('@/docs/category-help/fiat.md'),
  fund: import('@/docs/category-help/fund.md'),
  insurance: import('@/docs/category-help/insurance.md'),
  'payment processor': import('@/docs/category-help/payment-processor.md'),
  payments: import('@/docs/category-help/payments.md'),
  stablecoin: import('@/docs/category-help/stablecoin.md'),

  // Identity
  identity: import('@/docs/category-help/identity.md'),

  // Risk and Security
  'black mail activities': import('@/docs/category-help/black-mail-activities.md'),
  cybercrime: import('@/docs/category-help/cybercrime.md'),
  darknet: import('@/docs/category-help/darknet.md'),
  'financial crime, other': import('@/docs/category-help/financial-crime-other.md'),
  'fraud proof': import('@/docs/category-help/fraud-proof.md'),
  'high risk, other': import('@/docs/category-help/high-risk-other.md'),
  honeypot: import('@/docs/category-help/honeypot.md'),
  'malicious mining activities': import('@/docs/category-help/malicious-mining-activities.md'),
  malware: import('@/docs/category-help/malware.md'),
  'money laundering': import('@/docs/category-help/money-laundering.md'),
  phishing: import('@/docs/category-help/phishing.md'),
  ponzi: import('@/docs/category-help/ponzi.md'),
  ransom: import('@/docs/category-help/ransom.md'),
  scam: import('@/docs/category-help/scam.md'),
  spam: import('@/docs/category-help/spam.md'),
  terrorism: import('@/docs/category-help/terrorism.md'),
  theft: import('@/docs/category-help/theft.md'),
  vulnerable: import('@/docs/category-help/vulnerable.md'),
  weapons: import('@/docs/category-help/weapons.md'),
  l2: import('@/docs/category-help/l2.md'),

  // Entertainment
  gambling: import('@/docs/category-help/gambling.md'),
  gaming: import('@/docs/category-help/gaming.md'),
  sport: import('@/docs/category-help/sport.md'),
  streaming: import('@/docs/category-help/streaming.md'),

  // E-Commerce
  'company funds': import('@/docs/category-help/company-funds.md'),
  merchant: import('@/docs/category-help/merchant.md'),

  // Other
  'business or services, other': import('@/docs/category-help/business-or-services-other.md'),
  energy: import('@/docs/category-help/energy.md'),

  'personal-data': import('@/docs/category-help/personal-data.md'),
  'third-party-data': import('@/docs/category-help/third-party-data.md')
}

export default DOCS_MAP
