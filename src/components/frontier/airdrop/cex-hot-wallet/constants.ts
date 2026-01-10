export const EXCHANGE_URLS: Record<string, string> = {
  Binance: 'https://www.binance.com',
  Bybit: 'https://www.bybit.com',
  OKX: 'https://www.okx.com',
  Coinbase: 'https://www.coinbase.com',
  Kraken: 'https://www.kraken.com',
  Huobi: 'https://www.huobi.com',
  'Gate.io': 'https://www.gate.io',
  KuCoin: 'https://www.kucoin.com',
  Bitfinex: 'https://www.bitfinex.com',
  Bitget: 'https://www.bitget.com'
}

export const DEPOSIT_HISTORY_URLS: Record<string, string> = {
  Binance: 'https://www.binance.com/en/my/wallet/account/main/deposit/crypto',
  Bybit: 'https://www.bybit.com/user/assets/deposit',
  OKX: 'https://www.okx.com/balance/recharge',
  Coinbase: 'https://www.coinbase.com/accounts',
  Kraken: 'https://www.kraken.com/funding',
  Huobi: 'https://www.huobi.com/en-us/asset/deposit',
  'Gate.io': 'https://www.gate.io/myaccount/deposit',
  KuCoin: 'https://www.kucoin.com/assets/deposit',
  Bitfinex: 'https://www.bitfinex.com/deposit',
  Bitget: 'https://www.bitget.com/en/spot/deposit'
}

export const WITHDRAWAL_HISTORY_URLS: Record<string, string> = {
  Binance: 'https://www.binance.com/en/my/wallet/account/main/withdrawal/crypto',
  Bybit: 'https://www.bybit.com/user/assets/withdrawal',
  OKX: 'https://www.okx.com/balance/withdrawal',
  Coinbase: 'https://www.coinbase.com/accounts',
  Kraken: 'https://www.kraken.com/funding',
  Huobi: 'https://www.huobi.com/en-us/asset/withdraw',
  'Gate.io': 'https://www.gate.io/myaccount/withdraw',
  KuCoin: 'https://www.kucoin.com/assets/withdraw',
  Bitfinex: 'https://www.bitfinex.com/withdraw',
  Bitget: 'https://www.bitget.com/en/spot/withdraw'
}

export const EXPLORER_URLS: Record<string, string> = {
  BTC: 'https://www.blockchain.com/explorer/transactions/btc/{tx}',
  ETH: 'https://etherscan.io/tx/{tx}',
  TRON: 'https://tronscan.org/#/transaction/{tx}',
  SOL: 'https://explorer.solana.com/tx/{tx}',
  BNB: 'https://bscscan.com/tx/{tx}',
  ARB: 'https://arbiscan.io/tx/{tx}',
  OP: 'https://optimistic.etherscan.io/tx/{tx}',
  BASE: 'https://basescan.org/tx/{tx}',
  Polygon: 'https://polygonscan.com/tx/{tx}',
  ETC: 'https://etcblockexplorer.com/tx/{tx}',
  BCH: 'https://www.blockchain.com/explorer/transactions/bch/{tx}'
}

export const EXPLORER_ADDRESS_URLS: Record<string, string> = {
  BTC: 'https://www.blockchain.com/explorer/addresses/btc/{address}',
  ETH: 'https://etherscan.io/address/{address}',
  TRON: 'https://tronscan.org/#/address/{address}',
  SOL: 'https://explorer.solana.com/address/{address}',
  BNB: 'https://bscscan.com/address/{address}',
  ARB: 'https://arbiscan.io/address/{address}',
  OP: 'https://optimistic.etherscan.io/address/{address}',
  BASE: 'https://basescan.org/address/{address}',
  Polygon: 'https://polygonscan.com/address/{address}',
  ETC: 'https://etcblockexplorer.com/address/{address}',
  BCH: 'https://www.blockchain.com/explorer/addresses/bch/{address}'
}

export const NETWORK_TOKEN_OPTIONS: Record<string, string[]> = {
  BTC: ['BTC'],
  ETH: ['ETH', 'USDC', 'USDT', 'BNB', 'stETH'],
  TRON: ['TRX', 'USDT'],
  SOL: ['SOL'],
  BNB: ['BNB', 'ETH', 'USDC', 'USDT', 'XRP'],
  ARB: ['ETH'],
  OP: ['ETH'],
  BASE: ['ETH'],
  Polygon: ['POL'],
  ETC: ['ETC'],
  BCH: ['BCH']
}

export const NETWORK_COIN_OPTIONS: Record<string, string[]> = {
  BTC: ['BTC'],
  ETH: ['ETH', 'USDC', 'USDT', 'BNB', 'stETH'],
  TRON: ['TRX', 'USDT'],
  SOL: ['SOL'],
  BNB: ['BNB', 'ETH', 'USDC', 'BSC-USDT', 'XRP'],
  ARB: ['ETH'],
  OP: ['ETH'],
  BASE: ['ETH'],
  Polygon: ['POL'],
  ETC: ['ETC'],
  BCH: ['BCH']
}
