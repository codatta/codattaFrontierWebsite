import { UploadedImage } from '@/components/frontier/airdrop/UploadImg'

export interface DepositFormData {
  exchange_name: string
  screenshot: UploadedImage[]
  network: string
  token: string
  amount: string
  date: string
  exchange_address: string
  tx_hash: string
  explorer_screenshot: UploadedImage[]
  from_address: string
  to_address: string

  // Outgoing transaction section
  has_outgoing_transaction: 'yes' | 'no' | null
  outgoing_transaction_screenshot: UploadedImage[]
  outgoing_transaction_hash: string
  outgoing_tx_screenshot: UploadedImage[]
  outgoing_tx_from_address: string
  outgoing_tx_to_address: string
}

export interface WithdrawFormData {
  exchange_name: string
  exchange_screenshot: UploadedImage[]
  network: string
  coin: string
  amount: string
  network_fee: string
  address: string
  tx_hash: string
  transaction_date: string
  explorer_screenshot: UploadedImage[]
  sender_address: string
  receiver_address: string
}
