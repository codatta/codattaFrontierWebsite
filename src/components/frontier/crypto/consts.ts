import { type SelectOption } from '@/components/mobile-ui/select'

export const EXCHANGE_OPTIONS: SelectOption[] = [
  { value: 'binance', label: 'Binance' },
  { value: 'coinbase', label: 'Coinbase' },
  { value: 'kraken', label: 'Kraken' },
  { value: 'okx', label: 'OKX' },
  { value: 'bybit', label: 'Bybit' },
  { value: 'kucoin', label: 'KuCoin' },
  { value: 'gate.io', label: 'Gate.io' },
  { value: 'huobi', label: 'Huobi' }
]

export type Exchange = (typeof EXCHANGE_OPTIONS)[number]['value']

export const NETWORK_OPTIONS: SelectOption[] = [
  { value: 'ethereum', label: 'Ethereum' },
  // { value: 'bitcoin', label: 'Bitcoin' },
  // { value: 'solana', label: 'Solana' },
  // { value: 'polygon', label: 'Polygon' },
  { value: 'bsc', label: 'BSC' }
  // { value: 'arbitrum', label: 'Arbitrum' },
  // { value: 'optimism', label: 'Optimism' },
  // { value: 'avalanche', label: 'Avalanche' }
]

export type Network = (typeof NETWORK_OPTIONS)[number]['value']

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'eth', label: 'ETH' },
  // { value: 'btc', label: 'BTC' },
  // { value: 'sol', label: 'SOL' },
  { value: 'usdt', label: 'USDT' },
  { value: 'usdc', label: 'USDC' },
  // { value: 'matic', label: 'MATIC' },
  { value: 'bnb', label: 'BNB' }
  // { value: 'ada', label: 'ADA' }
]

export const NETWORK_OPTIONS_W7: SelectOption[] = [
  { value: 'ethereum', label: 'Ethereum' },
  { value: 'bsc', label: 'BSC' },
  { value: 'polygon', label: 'Polygon' },
  { value: 'base', label: 'Base' },
  { value: 'avalanche', label: 'Avalanche' }
]

export const CURRENCY_OPTIONS_W7: SelectOption[] = [
  { value: 'eth', label: 'ETH' },
  { value: 'bnb', label: 'BNB' },
  { value: 'usdt', label: 'USDT' },
  { value: 'usdc', label: 'USDC' },
  { value: 'matic', label: 'MATIC' },
  { value: 'arb', label: 'ARB' },
  { value: 'avax', label: 'AVAX' }
]

export type Currency = (typeof CURRENCY_OPTIONS)[number]['value']
