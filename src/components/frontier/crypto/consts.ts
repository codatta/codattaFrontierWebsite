import { type SelectOption } from './select'

export const EXCHANGE_OPTIONS: SelectOption[] = [
  { value: 'binance', text: 'Binance' },
  { value: 'coinbase', text: 'Coinbase' },
  { value: 'kraken', text: 'Kraken' },
  { value: 'okx', text: 'OKX' },
  { value: 'bybit', text: 'Bybit' },
  { value: 'kucoin', text: 'KuCoin' },
  { value: 'gate.io', text: 'Gate.io' },
  { value: 'huobi', text: 'Huobi' }
]

export type Exchange = (typeof EXCHANGE_OPTIONS)[number]['value']

export const BLOCKCHAIN_OPTIONS: SelectOption[] = [
  { value: 'ethereum', text: 'Ethereum' },
  { value: 'bitcoin', text: 'Bitcoin' },
  { value: 'solana', text: 'Solana' },
  { value: 'polygon', text: 'Polygon' },
  { value: 'bsc', text: 'BSC' },
  { value: 'arbitrum', text: 'Arbitrum' },
  { value: 'optimism', text: 'Optimism' },
  { value: 'avalanche', text: 'Avalanche' }
]

export type Blockchain = (typeof BLOCKCHAIN_OPTIONS)[number]['value']

export const CURRENCY_OPTIONS: SelectOption[] = [
  { value: 'eth', text: 'ETH' },
  { value: 'btc', text: 'BTC' },
  { value: 'sol', text: 'SOL' },
  { value: 'usdt', text: 'USDT' },
  { value: 'usdc', text: 'USDC' },
  { value: 'matic', text: 'MATIC' },
  { value: 'bnb', text: 'BNB' },
  { value: 'ada', text: 'ADA' }
]

export type Currency = (typeof CURRENCY_OPTIONS)[number]['value']
