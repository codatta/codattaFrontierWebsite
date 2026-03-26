/**
 * Gas fee calculation utilities for blockchain transactions (USDT pricing)
 */

export interface ChainConfig {
  name: string
  rpc: string
  nativeToken: string
  priceApi: string
  priceSymbol: string
  feeTokenAddress: string // ERC20 token contract address for fee calculation
}

// XNY token addresses for different environments
const XNY_TOKEN_ADDRESSES = {
  production: '0xE3225e11Cab122F1a126A28997788E5230838ab9',
  testnet: '0xe9fC6F3CcD332e84054D8Afd148ecE66BF18C2bA'
}

/**
 * Check if the token address is XNY token
 */
function isXnyToken(tokenAddress: string): boolean {
  const normalizedAddress = tokenAddress.toLowerCase()
  return (
    normalizedAddress === XNY_TOKEN_ADDRESSES.production.toLowerCase() ||
    normalizedAddress === XNY_TOKEN_ADDRESSES.testnet.toLowerCase()
  )
}

export const CHAIN_CONFIGS: Record<string, ChainConfig> = {
  bsc: {
    name: 'BSC',
    rpc: 'https://bsc-dataseed1.binance.org',
    nativeToken: 'BNB',
    priceApi: 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
    priceSymbol: 'binancecoin',
    feeTokenAddress: '0x55d398326f99059fF775485246999027B3197955' // BSC USDT
  },
  baseSepolia: {
    name: 'Base Sepolia',
    rpc: 'https://sepolia.base.org',
    nativeToken: 'ETH',
    priceApi: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    priceSymbol: 'ethereum',
    feeTokenAddress: '0x036CbD53842c5426634e7929541eC2318f3dCF7e' // Base Sepolia USDT (testnet)
  },
  base: {
    name: 'Base',
    rpc: 'https://mainnet.base.org',
    nativeToken: 'ETH',
    priceApi: 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
    priceSymbol: 'ethereum',
    feeTokenAddress: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' // Base USDC
  }
}

/**
 * Get ERC20 token decimals from blockchain
 * @param rpcUrl - RPC endpoint URL
 * @param tokenAddress - ERC20 token contract address
 * @returns decimals
 */
export async function getTokenDecimals(rpcUrl: string, tokenAddress: string): Promise<number> {
  // ERC20 decimals() function selector: 0x313ce567
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_call',
      params: [
        {
          to: tokenAddress,
          data: '0x313ce567'
        },
        'latest'
      ],
      id: 1
    })
  })
  const data = (await response.json()) as { result: string }
  return parseInt(data.result, 16)
}

/**
 * Calculate gas fee value in USD (applicable to USD-pegged stablecoins like USDT)
 *
 * Formula: gasLimit × gasPrice × nativeTokenUsdPrice
 *
 * @param gasLimit - Gas amount (e.g., 150000)
 * @param gasPriceGwei - Gas price in Gwei (e.g., 20)
 * @param nativeTokenUsdPrice - Native token price in USD (e.g., ETH = $3000)
 * @param _tokenDecimals - Reserved for future use (currently not used as we return USD value)
 * @returns USD value (e.g., 0.009 means $0.009 ≈ 0.009 USDT)
 *
 * @example
 * // ETH: gasLimit=150000, gasPrice=20 Gwei, ETH=$3000
 * // Fee = 150000 × 20 × 10^9 Wei = 3 × 10^15 Wei = 0.003 ETH
 * // USD = 0.003 × $3000 = $9
 * calculateGasFeeInToken(150000, 20, 3000, 6) // returns 9.0
 */
export function calculateGasFeeInToken(
  gasLimit: number,
  gasPriceGwei: number,
  nativeTokenUsdPrice: number,
  _tokenDecimals: number
): number {
  // Step 1: Calculate total gas cost in Wei
  // gasLimit × gasPrice(Gwei) × 10^9 = Wei
  const totalWei = BigInt(gasLimit) * BigInt(Math.floor(gasPriceGwei * 1e9))

  // Step 2: Convert Wei to native token (ETH/BNB)
  // Wei ÷ 10^18 = native token amount
  const nativeTokenAmount = Number(totalWei) * 1e-18

  // Step 3: Convert native token to USD value
  // native token × USD price = USD value
  // Since USDT ≈ 1 USD, this USD value ≈ USDT amount
  const usdValue = nativeTokenAmount * nativeTokenUsdPrice

  return usdValue
}

/**
 * Get gas price from RPC endpoint
 */
export async function getGasPriceFromRpc(rpcUrl: string): Promise<number> {
  const response = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'eth_gasPrice',
      params: [],
      id: 1
    })
  })
  const data = (await response.json()) as { result: string }
  const wei = parseInt(data.result, 16)
  return wei / 1e9
}

/**
 * Get token price from CoinGecko API
 */
export async function getTokenPriceFromCoinGecko(priceApi: string, coinId: string): Promise<number> {
  const response = await fetch(priceApi)
  const data = (await response.json()) as Record<string, { usd: number }>
  return data[coinId].usd
}

// XNY price cache to avoid rate limiting
let xnyPriceCache: { price: number; timestamp: number } | null = null
const XNY_PRICE_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Get XNY token price in USD with caching mechanism
 * Tries CoinGecko API first, then falls back to hardcoded price
 */
export async function getXnyTokenPrice(): Promise<number> {
  const FALLBACK_PRICE = 0.001907

  // Check cache first
  if (xnyPriceCache && Date.now() - xnyPriceCache.timestamp < XNY_PRICE_CACHE_DURATION) {
    console.log('Using cached XNY price:', xnyPriceCache.price)
    return xnyPriceCache.price
  }

  // Try CoinGecko API
  try {
    const XNY_COIN_ID = 'xny'
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${XNY_COIN_ID}&vs_currencies=usd`, {
      cache: 'no-cache'
    })

    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as Record<string, { usd: number }>

    if (data[XNY_COIN_ID]?.usd) {
      const price = data[XNY_COIN_ID].usd
      xnyPriceCache = { price, timestamp: Date.now() }
      console.log('Fetched XNY price from CoinGecko:', price)
      return price
    }

    console.warn('XNY price not found in CoinGecko response, using fallback')
    return FALLBACK_PRICE
  } catch (error) {
    console.warn('Failed to fetch XNY price from CoinGecko, using fallback:', error)
    // Use cached price if available, even if expired
    if (xnyPriceCache) {
      console.log('Using expired cache due to API error:', xnyPriceCache.price)
      return xnyPriceCache.price
    }
    return FALLBACK_PRICE
  }
}

/**
 * Calculate gas fee from API (gas price + token price)
 * @param gasLimit - Gas amount
 * @param chainKey - Chain identifier (bsc, baseSepolia, base)
 * @param tokenAddress - Optional custom ERC20 token address (overrides chain default config)
 * @returns ERC20 token value
 */
export async function calculateGasFeeFromApi(
  gasLimit: number,
  chainKey: string = 'baseSepolia',
  tokenAddress?: string
): Promise<number> {
  const config = CHAIN_CONFIGS[chainKey] || CHAIN_CONFIGS.baseSepolia
  const feeTokenAddr = tokenAddress || config.feeTokenAddress

  try {
    // Fetch in parallel: native token price, gas price, token decimals
    const [nativeTokenUsdPrice, gasPriceGwei, decimals] = await Promise.all([
      getTokenPriceFromCoinGecko(config.priceApi, config.priceSymbol),
      getGasPriceFromRpc(config.rpc),
      getTokenDecimals(config.rpc, feeTokenAddr)
    ])

    console.log('=== Gas Calculation ===')
    console.log('Chain:', config.name)
    console.log('Native Token Price:', nativeTokenUsdPrice, 'USD')
    console.log('Gas Price:', gasPriceGwei, 'Gwei')
    console.log('Gas Limit:', gasLimit)
    console.log('Fee Token Address:', feeTokenAddr)
    console.log('Fee Token Decimals:', decimals)

    // Calculate gas fee in USD (based on native token price)
    const feeInUsd = calculateGasFeeInToken(gasLimit, gasPriceGwei, nativeTokenUsdPrice, decimals)
    console.log('Gas Fee in USD:', feeInUsd.toFixed(6), 'USD')

    // For XNY token, convert USD value to XNY amount using dynamic price
    if (isXnyToken(feeTokenAddr)) {
      const xnyUsdPrice = await getXnyTokenPrice()
      const feeInXny = feeInUsd / xnyUsdPrice
      console.log('XNY Token Detected')
      console.log('XNY Price:', xnyUsdPrice, 'USD')
      console.log('Estimated Fee:', feeInXny.toFixed(6), 'XNY')
      console.log('======================')
      return feeInXny
    }

    // For USDT and other stablecoins, USD value ≈ token amount
    console.log('Estimated Fee:', feeInUsd.toFixed(6), 'tokens')
    console.log('======================')
    return feeInUsd
  } catch (error) {
    console.error('Failed to calculate gas fee:', error)
    throw error
  }
}

/**
 * Get chain config key by chain ID
 */
export function getChainKeyByChainId(chainId: number): string {
  // Base Sepolia: 84532
  // Base: 8453
  // BSC: 56
  const chainIdMap: Record<number, string> = {
    56: 'bsc',
    8453: 'base',
    84532: 'baseSepolia'
  }
  return chainIdMap[chainId] || 'baseSepolia'
}
