import { bscTestnet, bsc } from 'viem/chains'
import SmartContract from './contract.interface'

// test net config
const TESTNET = bscTestnet
const CONTRACT_ADDRESS_TESTNET = ''

// mainnet config
const MAINNET = bsc
const CONTRACT_ADDRESS_MAINNET = ''

const contract: SmartContract = {
  chain: import.meta.env.VITE_MODE === 'production' ? MAINNET : TESTNET,
  address: import.meta.env.VITE_MODE === 'production' ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET,
  abi: []
}

export default contract
