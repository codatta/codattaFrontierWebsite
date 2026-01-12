export interface ExchangeItem {
  name: string
  official_website: string
  deposit_history_url: string
  withdrawal_history_url: string
}

export interface NetworkItem {
  network: string
  name: string
  explorer_url: string
  explorer_address_url: string
  token_options: string[]
  coin_options: string[]
}

export const NETWORKS: NetworkItem[] = [
  {
    network: 'btc',
    name: 'BTC',
    explorer_url: 'https://www.blockchain.com/explorer/transactions/btc/${tx}',
    explorer_address_url: 'https://www.blockchain.com/explorer/addresses/btc/${address}',
    token_options: ['BTC'],
    coin_options: ['BTC']
  },
  {
    network: 'eth',
    name: 'ETH',
    explorer_url: 'https://etherscan.io/tx/${tx}',
    explorer_address_url: 'https://etherscan.io/address/${address}',
    token_options: ['ETH', 'USDC', 'USDT', 'BNB', 'stETH'],
    coin_options: ['ETH', 'USDC', 'USDT', 'BNB', 'stETH']
  },
  {
    network: 'tron',
    name: 'TRON',
    explorer_url: 'https://tronscan.org/#/transaction/${tx}',
    explorer_address_url: 'https://tronscan.org/#/address/${address}',
    token_options: ['TRX', 'USDT'],
    coin_options: ['TRX', 'USDT']
  },
  {
    network: 'sol',
    name: 'SOL',
    explorer_url: 'https://explorer.solana.com/tx/${tx}',
    explorer_address_url: 'https://explorer.solana.com/address/${address}',
    token_options: ['SOL'],
    coin_options: ['SOL']
  },
  {
    network: 'bnb',
    name: 'BNB',
    explorer_url: 'https://bscscan.com/tx/${tx}',
    explorer_address_url: 'https://bscscan.com/address/${address}',
    token_options: ['BNB', 'ETH', 'USDC', 'USDT', 'XRP'],
    coin_options: ['BNB', 'ETH', 'USDC', 'BSC-USDT', 'XRP']
  },
  {
    network: 'arb',
    name: 'ARB',
    explorer_url: 'https://arbiscan.io/tx/${tx}',
    explorer_address_url: 'https://arbiscan.io/address/${address}',
    token_options: ['ETH'],
    coin_options: ['ETH']
  },
  {
    network: 'op',
    name: 'OP',
    explorer_url: 'https://optimistic.etherscan.io/tx/${tx}',
    explorer_address_url: 'https://optimistic.etherscan.io/address/${address}',
    token_options: ['ETH'],
    coin_options: ['ETH']
  },
  {
    network: 'base',
    name: 'BASE',
    explorer_url: 'https://basescan.org/tx/${tx}',
    explorer_address_url: 'https://basescan.org/address/${address}',
    token_options: ['ETH'],
    coin_options: ['ETH']
  },
  {
    network: 'polygon',
    name: 'Polygon',
    explorer_url: 'https://polygonscan.com/tx/${tx}',
    explorer_address_url: 'https://polygonscan.com/address/${address}',
    token_options: ['POL'],
    coin_options: ['POL']
  },
  {
    network: 'etc',
    name: 'ETC',
    explorer_url: 'https://etcblockexplorer.com/tx/${tx}',
    explorer_address_url: 'https://etcblockexplorer.com/address/${address}',
    token_options: ['ETC'],
    coin_options: ['ETC']
  },
  {
    network: 'bch',
    name: 'BCH',
    explorer_url: 'https://www.blockchain.com/explorer/transactions/bch/${tx}',
    explorer_address_url: 'https://www.blockchain.com/explorer/addresses/bch/${address}',
    token_options: ['BCH'],
    coin_options: ['BCH']
  }
]

const EXCHANGES: ExchangeItem[] = [
  {
    name: 'Kraken',
    official_website: 'https://www.kraken.com',
    deposit_history_url: 'https://www.kraken.com/funding',
    withdrawal_history_url: 'https://www.kraken.com/funding'
  },
  {
    name: 'Bitget',
    official_website: 'https://www.bitget.com',
    deposit_history_url: 'https://www.bitget.com/en/spot/deposit',
    withdrawal_history_url: 'https://www.bitget.com/en/spot/withdraw'
  },
  {
    name: 'Binance',
    official_website: 'https://www.binance.com/',
    deposit_history_url: 'https://www.binance.com/en/my/wallet/account/main/deposit/crypto',
    withdrawal_history_url: 'https://www.binance.com/en/my/wallet/account/main/withdrawal/crypto/'
  },
  {
    name: 'IndoEx',
    official_website: 'https://www.indoex.io/',
    deposit_history_url: 'https://www.indoex.io/records',
    withdrawal_history_url: 'https://www.indoex.io/records'
  },
  {
    name: 'Tokocrypto',
    official_website: 'https://www.tokocrypto.com',
    deposit_history_url: 'https://www.tokocrypto.com/usercenter/wallet/deposit',
    withdrawal_history_url: 'https://www.tokocrypto.com/usercenter/wallet/withdrawals'
  },
  {
    name: 'CoinW',
    official_website: 'https://www.coinw.com/',
    deposit_history_url: 'https://www.coinw.com/wallet/deposit',
    withdrawal_history_url: 'https://www.coinw.com/wallet/withdraw'
  },
  {
    name: 'CEX.IO',
    official_website: 'https://cex.io/',
    deposit_history_url: 'https://wallet.cex.io/operations/add-funds?asset=0G',
    withdrawal_history_url: 'https://wallet.cex.io/operations/withdrawal?asset=0G'
  },
  {
    name: 'Ju.com',
    official_website: 'https://www.ju.com',
    deposit_history_url: 'https://www.ju.com/wallet/account/common/deposit',
    withdrawal_history_url: 'https://www.ju.com/wallet/account/common/withdrawal'
  },
  {
    name: 'Bitso',
    official_website: 'https://bitso.com',
    deposit_history_url: 'https://bitso.com/r/user/history/deposits',
    withdrawal_history_url: 'https://bitso.com/r/user/history/withdrawals'
  },
  {
    name: 'Upbit',
    official_website: 'https://th.upbit.com/',
    deposit_history_url: 'https://th.upbit.com/balances/THB?tab=deposit',
    withdrawal_history_url: 'https://th.upbit.com/balances/THB?tab=withdraw'
  },
  {
    name: 'P2B',
    official_website: 'https://p2pb2b.com/',
    deposit_history_url: 'https://p2pb2b.com/assets/deposit/',
    withdrawal_history_url: 'https://p2pb2b.com/assets/withdraw/'
  },
  {
    name: 'CoinUp.io',
    official_website: 'https://www.coinup.io/',
    deposit_history_url: 'https://www.coinup.io/en_US/assets/recharge',
    withdrawal_history_url: 'https://www.coinup.io/en_US/assets/withdraw'
  },
  {
    name: 'OKX',
    official_website: 'https://www.okx.com/',
    deposit_history_url: 'https://www.okx.com/balance/recharge',
    withdrawal_history_url: 'https://www.okx.com/balance/withdrawal'
  },
  {
    name: 'HTX (ex-Huobi)',
    official_website: 'https://www.htx.com/',
    deposit_history_url: 'https://www.htx.com/en-us/finance/deposit/usdt',
    withdrawal_history_url: 'https://www.htx.com/en-us/finance/withdraw/usdt'
  },
  {
    name: 'OrangeX',
    official_website: 'https://www.orangex.com',
    deposit_history_url: 'https://www.orangex.com/account/wallet/deposit',
    withdrawal_history_url: 'https://www.orangex.com/account/wallet/withdraw'
  },
  {
    name: 'CoinEx',
    official_website: 'https://www.coinex.com',
    deposit_history_url: 'https://www.coinex.com/en/asset/deposit',
    withdrawal_history_url: 'https://www.coinex.com/en/asset/withdraw'
  },
  {
    name: 'Bybit',
    official_website: 'https://www.bybit.com/',
    deposit_history_url: 'https://www.bybit.com/user/assets/deposit',
    withdrawal_history_url: 'https://www.bybit.com/user/assets/withdraw'
  },
  {
    name: 'MAX Exchange',
    official_website: 'https://max.maicoin.com/',
    deposit_history_url: 'https://max.maicoin.com/funds/twd/deposits',
    withdrawal_history_url: 'https://max.maicoin.com/funds/twd/withdraws'
  },
  {
    name: 'KuCoin',
    official_website: 'https://www.kucoin.com/',
    deposit_history_url: 'https://www.kucoin.com/assets/record',
    withdrawal_history_url: 'https://www.kucoin.com/assets/record'
  },
  {
    name: 'Gate.io',
    official_website: 'https://www.gate.com/',
    deposit_history_url: 'https://www.gate.com/myaccount/funds/deposit/USDT',
    withdrawal_history_url: 'https://www.gate.com/myaccount/funds/withdraw/USDT'
  },
  {
    name: 'WOO X',
    official_website: 'https://woox.io/',
    deposit_history_url: 'https://woox.io/en/wallet',
    withdrawal_history_url: 'https://woox.io/en/wallet'
  },
  {
    name: 'Koinbay',
    official_website: 'https://www.koinbay.com/en_US/trade/',
    deposit_history_url: 'https://www.koinbay.com/en_US/trade/ADA_BTC?type=spot',
    withdrawal_history_url: 'https://www.koinbay.com/en_US/assets/withdraw'
  },
  {
    name: 'Backpack Exchange',
    official_website: 'https://backpack.exchange/',
    deposit_history_url: 'https://backpack.exchange/portfolio/transfers/deposits',
    withdrawal_history_url: 'https://backpack.exchange/portfolio/transfers/withdrawals'
  },
  {
    name: 'DigiFinex',
    official_website: 'https://www.digifinex.com/',
    deposit_history_url: 'https://www.digifinex.com/id-id/n/deposit',
    withdrawal_history_url: 'https://www.digifinex.com/id-id/n/withdraw'
  },
  {
    name: 'YUBIT',
    official_website: 'https://www.yubit.com',
    deposit_history_url: 'https://www.yubit.com/assets/deposit',
    withdrawal_history_url: 'https://www.yubit.com/assets/withdraw'
  },
  {
    name: 'BTCC',
    official_website: 'https://www.btcc.com/en-US',
    deposit_history_url: 'https://www.btcc.com/en-US/user-center/assets/deposit/crypto',
    withdrawal_history_url: 'https://www.btcc.com/en-US/user-center/assets/withdraw/crypto'
  },
  {
    name: 'Coinbase Exchange',
    official_website: 'https://www.coinbase.com/home',
    deposit_history_url: 'https://www.coinbase.com/transactions',
    withdrawal_history_url: 'https://www.coinbase.com/transactions'
  },
  {
    name: 'Hibt',
    official_website: 'https://www.hibt.com/',
    deposit_history_url: 'https://www.hibt.com/recharge',
    withdrawal_history_url: 'https://www.hibt.com/withdraw'
  },
  {
    name: 'Pionex',
    official_website: 'https://www.pionex.com/id/',
    deposit_history_url: 'https://www.pionex.com/id/balance/deposit/',
    withdrawal_history_url: 'https://www.pionex.com/id/balance/withdraw/'
  },
  {
    name: 'Coinstore',
    official_website: 'https://www.coinstore.com/',
    deposit_history_url: 'https://www.coinstore.com/assets/deposit',
    withdrawal_history_url: 'https://www.coinstore.com/assets/withdraw'
  },
  {
    name: 'VOOX Exchange',
    official_website: 'https://www.voox.com/',
    deposit_history_url: 'https://www.voox.com/en_US/wallet/recharge',
    withdrawal_history_url: 'https://www.voox.com/en_US/wallet/withdraw'
  },
  {
    name: 'Bitunix',
    official_website: 'https://www.bitunix.com/',
    deposit_history_url: 'https://www.bitunix.com/id-id/assets/recharge',
    withdrawal_history_url: 'https://www.bitunix.com/id-id/assets/withdraw'
  },
  {
    name: 'Coinone',
    official_website: 'https://coinone.co.kr',
    deposit_history_url: 'https://coinone.co.kr/balance/transfer/krw/deposit',
    withdrawal_history_url: 'https://coinone.co.kr/balance/transfer/krw/withdraw'
  },
  {
    name: 'FameEX',
    official_website: 'https://www.fameex.com/',
    deposit_history_url: 'https://www.fameex.com/en-US/balance/trade/deposit',
    withdrawal_history_url: 'https://www.fameex.com/en-US/balance/trade/withdrawl'
  },
  {
    name: 'Biconomy.com',
    official_website: 'https://www.biconomy.com/en',
    deposit_history_url: 'https://www.biconomy.com/en/user-center/deposit',
    withdrawal_history_url: 'https://www.biconomy.com/en/user-center/withdraw'
  },
  {
    name: 'All InX',
    official_website: 'https://www.allinx.io/',
    deposit_history_url: 'https://www.allinx.io/wallet/deposit',
    withdrawal_history_url: 'https://www.allinx.io/wallet/withdraw'
  },
  {
    name: 'UZX',
    official_website: 'https://uzx.com/',
    deposit_history_url: 'https://uzx.com/deposit',
    withdrawal_history_url: 'https://uzx.com/withdraw'
  },
  {
    name: 'Cube Exchange',
    official_website: 'https://www.cube.exchange/',
    deposit_history_url: 'https://www.cube.exchange/portfolio',
    withdrawal_history_url: 'https://www.cube.exchange/portfolio'
  },
  {
    name: 'Bitkub',
    official_website: 'https://www.bitkub.com',
    deposit_history_url: 'https://www.bitkub.com/th/history',
    withdrawal_history_url: 'https://www.bitkub.com/th/history'
  },
  {
    name: 'Toobit',
    official_website: 'https://www.toobit.com',
    deposit_history_url: 'https://www.toobit.com/en-US/recharge/USDT',
    withdrawal_history_url: 'https://www.toobit.com/en-US/withdrawal/USDT'
  },
  {
    name: 'Deepcoin',
    official_website: 'https://www.deepcoin.com',
    deposit_history_url: 'https://www.deepcoin.com/turbo/en/my/assets/deposit',
    withdrawal_history_url: 'https://www.deepcoin.com/turbo/en/my/assets/withdrawal'
  },
  {
    name: 'LATOKEN',
    official_website: 'https://latoken.com',
    deposit_history_url: 'https://latoken.com/wallet/total/transactions?transactionType=deposit',
    withdrawal_history_url: 'https://latoken.com/wallet/total/transactions?transactionType=withdrawal'
  },
  {
    name: 'Hotcoin',
    official_website: 'https://www.hotcoin.com',
    deposit_history_url: 'https://www.hotcoin.com/en_US/assetManagement/topup/',
    withdrawal_history_url: 'https://www.hotcoin.com/en_US/assetManagement/extract/'
  },
  {
    name: 'Fastex',
    official_website: 'https://exchange.fastex.com/',
    deposit_history_url: 'https://exchange.fastex.com/assets/deposit',
    withdrawal_history_url: 'https://exchange.fastex.com/assets/withdraw'
  },
  {
    name: 'BigONE',
    official_website: 'https://big.one/',
    deposit_history_url: 'https://big.one/en/accounts/deposit',
    withdrawal_history_url: 'https://big.one/en/accounts/withdrawal'
  },
  {
    name: 'Binance TH',
    official_website: 'https://www.binance.th/',
    deposit_history_url: 'https://www.binance.th/en/my/wallet/account/main/deposit/crypto',
    withdrawal_history_url: 'https://www.binance.th/en/my/wallet/account/main/withdrawal/crypto'
  },
  {
    name: 'Dex-Trade',
    official_website: 'https://dex-trade.com',
    deposit_history_url: 'https://dex-trade.com/transaction-history',
    withdrawal_history_url: 'https://dex-trade.com/transaction-history'
  },
  {
    name: 'EXMO',
    official_website: 'https://exmo.com/',
    deposit_history_url: 'https://exmo.com/wallet/deposit/UAH',
    withdrawal_history_url: 'https://exmo.com/wallet/withdrawal/USD'
  },
  {
    name: 'Azbit',
    official_website: 'https://azbit.com/exchange',
    deposit_history_url: 'https://azbit.com/dashboard/deposit',
    withdrawal_history_url: 'https://azbit.com/dashboard/withdraw'
  },
  {
    name: 'BloFin',
    official_website: 'https://blofin.com/',
    deposit_history_url: 'https://blofin.com/en/assets/deposit',
    withdrawal_history_url: 'https://blofin.com/en/assets/withdraw'
  },
  {
    name: 'Bitrue',
    official_website: 'https://www.bitrue.com',
    deposit_history_url: 'https://www.bitrue.com/assets/spot/deposit',
    withdrawal_history_url: 'https://www.bitrue.com/assets/spot/withdraw'
  },
  {
    name: 'ProBit Global',
    official_website: 'https://www.probit.com/en-us/',
    deposit_history_url: 'https://www.probit.com/en-us/user-center/wallet/deposit/',
    withdrawal_history_url: 'https://www.probit.com/en-us/user-center/wallet/withdrawal/'
  },
  {
    name: 'Zoomex',
    official_website: 'https://www.zoomex.com/',
    deposit_history_url: 'https://www.zoomex.com/user/assets/deposit',
    withdrawal_history_url: 'https://www.zoomex.com/user/assets/withdraw/'
  },
  {
    name: 'Phemex',
    official_website: 'https://phemex.com',
    deposit_history_url: 'https://phemex.com/assets/deposit?currency=USDT',
    withdrawal_history_url: 'https://phemex.com/assets/withdrawal'
  },
  {
    name: 'Tapbit',
    official_website: 'https://www.tapbit.com/en',
    deposit_history_url: 'https://www.tapbit.com/personal/deposit',
    withdrawal_history_url: 'https://www.tapbit.com/personal/withdrawal'
  },
  {
    name: 'Bitfinex',
    official_website: 'https://www.bitfinex.com/',
    deposit_history_url: 'https://movement.bitfinex.com/deposit',
    withdrawal_history_url: 'https://movement.bitfinex.com/withdraw'
  },
  {
    name: 'Upbit',
    official_website: 'https://th.upbit.com/',
    deposit_history_url: 'https://th.upbit.com/balances/THB?tab=deposit',
    withdrawal_history_url: 'https://th.upbit.com/balances/THB?tab=withdraw'
  },
  {
    name: 'MEXC',
    official_website: 'https://www.mexc.co/',
    deposit_history_url: 'https://www.mexc.co/assets/record',
    withdrawal_history_url: 'https://www.mexc.co/assets/record'
  }
]

export const getExplorerUrl = (network: string, tx: string) => {
  const explorer = NETWORKS.find((item) => item.network === network.toLowerCase())
  return explorer?.explorer_url.replace('${tx}', tx)
}

export const getExplorerAddressUrl = (network: string, address: string) => {
  const explorer = NETWORKS.find((item) => item.network === network.toLowerCase())
  return explorer?.explorer_address_url.replace('${address}', address)
}

export const getExchanges = (page: number, pageSize = 10) => {
  const exchanges = EXCHANGES.slice((page - 1) * pageSize, page * pageSize)
  return exchanges.length ? exchanges : exchanges.slice(-10)
}
