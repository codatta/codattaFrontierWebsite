import { UploadedImage } from '@/components/frontier/airdrop/UploadImg'

export interface DepositFormData {
  exchangeName: string
  depositScreenshot: UploadedImage[]
  depositNetwork: string
  depositToken: string
  depositAmount: string
  depositDate: string
  exchangeDepositAddress: string
  depositTxHash: string
  explorerScreenshot: UploadedImage[]
  depositFromAddress: string
  depositToAddress: string

  // Outgoing transaction section
  hasOutgoingTransaction: 'yes' | 'no' | null
  outgoingTransactionScreenshot: UploadedImage[]
  outgoingTransactionHash: string
  outgoingTxScreenshot: UploadedImage[]
  outgoingTxFromAddress: string
  outgoingTxToAddress: string
}

export interface WithdrawFormData {
  exchangeName: string
  exchangeScreenshot: UploadedImage[]
  withdrawNetwork: string
  withdrawCoin: string
  withdrawAmount: string
  withdrawNetworkFee: string
  withdrawalAddress: string
  withdrawalTxHash: string
  transactionDate: string
  explorerScreenshot: UploadedImage[]
  senderAddress: string
  receiverAddress: string
}
