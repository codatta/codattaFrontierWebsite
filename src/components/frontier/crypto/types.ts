import type { Exchange, Network, Currency } from './consts'

export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'

export type WithdrawFormData = {
  exchange: Exchange
  network: Network
  currency: Currency
  // transactionHash: string
  // sourceAddress: string
  images: { url: string; hash: string }[]
}

export type DepositFormData = {
  exchange: Exchange
  network: Network
  currency: Currency
  // transactionHash: string
  // depositAddressTransactionHash?: string
  // depositAddress: string
  images: { url: string; hash: string }[]
}
