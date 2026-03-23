import { bsc } from 'viem/chains'
import { Abi, Chain } from 'viem'
import { baseSepolia } from 'viem/chains'

const MAINNET = bsc

const CONTRACT_ADDRESS_TESTNET = '0x89A688B8fd4Be6e183402d09669559Bb74bDdFFE'
const CONTRACT_ADDRESS_MAINNET = '0x822B080a3Af1686Bf3BAFA53D7aE10b3212B2F17'

// const isProduction = true // TODO rm online
const isProduction = import.meta.env.VITE_MODE === 'production'

console.log('isProduction', isProduction)

const address = isProduction && CONTRACT_ADDRESS_MAINNET ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET
const chain = isProduction ? MAINNET : baseSepolia

const contract: { abi: Abi; chain: Chain; address: string } = {
  chain,
  address,
  abi: []
}

export default contract
