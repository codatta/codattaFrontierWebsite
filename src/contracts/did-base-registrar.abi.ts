import { Abi, Chain, defineChain } from 'viem'
import { base } from 'viem/chains'

const TESTNET = defineChain({
  id: 2368,
  name: 'KiteAI Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'KITE',
    symbol: 'KITE'
  },
  rpcUrls: {
    default: { http: ['https://rpc-testnet.gokite.ai/'] }
  },
  blockExplorers: {
    default: {
      name: 'kitescan',
      url: 'https://testnet.kitescan.ai/'
    }
  }
})
const MAINNET = base

const CONTRACT_ADDRESS_TESTNET = '0xC9D49eDec9824BC07e59B4904512d432a4Cd7982'
const CONTRACT_ADDRESS_MAINNET = '0x' // TODO

const contract: { abi: Abi; chain: Chain; address: string } = {
  chain: import.meta.env.VITE_MODE === 'production' ? MAINNET : TESTNET,
  address: import.meta.env.VITE_MODE === 'production' ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET,
  abi: [
    { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
    { type: 'function', name: 'register', inputs: [], outputs: [], stateMutability: 'nonpayable' },
    {
      type: 'function',
      name: 'registerWithAuthorization',
      inputs: [{ name: 'authorizations', type: 'bytes[]', internalType: 'bytes[]' }],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'setRegistry',
      inputs: [{ name: 'registry', type: 'address', internalType: 'address' }],
      outputs: [],
      stateMutability: 'nonpayable'
    }
  ]
}

export default contract
