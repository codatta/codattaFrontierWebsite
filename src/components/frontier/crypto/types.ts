import type { Exchange, Blockchain, Currency } from './consts'

export type ResultType = 'PENDING' | 'REJECT' | 'ADOPT'

export type WithdrawFormData = {
  exchange: Exchange
  blockchain: Blockchain
  currency: Currency
  transactionHash: string
  sourceAddress: string
  images: { url: string; hash: string }[]
}

export type DepositFormData = {
  exchange: Exchange
  blockchain: Blockchain
  currency: Currency
  transactionHash: string
  depositAddressTransactionHash?: string
  depositAddress: string
  images: { url: string; hash: string }[]
}
