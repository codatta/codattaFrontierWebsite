import { Abi, Chain, defineChain } from 'viem'
import { bsc } from 'viem/chains'

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
const MAINNET = bsc

const CONTRACT_ADDRESS_TESTNET = '0xD57551f1c6397319f645236F5bc6aFa526A5a3b3'
const CONTRACT_ADDRESS_MAINNET = '0x822B080a3Af1686Bf3BAFA53D7aE10b3212B2F17'

const contract: { abi: Abi; chain: Chain; address: string } = {
  chain: import.meta.env.VITE_MODE === 'production' ? MAINNET : TESTNET,
  address: import.meta.env.VITE_MODE === 'production' ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET,
  abi: [
    {
      type: 'constructor',
      inputs: [{ name: '_signer', type: 'address', internalType: 'address' }],
      stateMutability: 'nonpayable'
    },
    { type: 'receive', stateMutability: 'payable' },
    {
      type: 'function',
      name: 'claim',
      inputs: [
        { name: 'uid', type: 'bytes32', internalType: 'bytes32' },
        { name: 'token', type: 'address', internalType: 'address' },
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
        { name: 'expiredAt', type: 'uint256', internalType: 'uint256' },
        { name: 'signature', type: 'bytes', internalType: 'bytes' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'claims',
      inputs: [
        { name: '', type: 'bytes32', internalType: 'bytes32' },
        { name: '', type: 'address', internalType: 'address' }
      ],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'hasClaimed',
      inputs: [
        { name: 'uid', type: 'bytes32', internalType: 'bytes32' },
        { name: 'recipient', type: 'address', internalType: 'address' }
      ],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'owner',
      inputs: [],
      outputs: [{ name: '', type: 'address', internalType: 'address' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'renounceOwnership',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'signer',
      inputs: [],
      outputs: [{ name: '', type: 'address', internalType: 'address' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'transferOwnership',
      inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'updateSigner',
      inputs: [{ name: 'newSigner', type: 'address', internalType: 'address' }],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'withdraw',
      inputs: [
        { name: 'token', type: 'address', internalType: 'address' },
        { name: 'amount', type: 'uint256', internalType: 'uint256' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'event',
      name: 'AdminWithdraw',
      inputs: [
        {
          name: 'token',
          type: 'address',
          indexed: false,
          internalType: 'address'
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'Claim',
      inputs: [
        {
          name: 'uid',
          type: 'bytes32',
          indexed: true,
          internalType: 'bytes32'
        },
        {
          name: 'token',
          type: 'address',
          indexed: false,
          internalType: 'address'
        },
        {
          name: 'recipient',
          type: 'address',
          indexed: false,
          internalType: 'address'
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'OwnershipTransferred',
      inputs: [
        {
          name: 'previousOwner',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'newOwner',
          type: 'address',
          indexed: true,
          internalType: 'address'
        }
      ],
      anonymous: false
    },
    { type: 'error', name: 'ECDSAInvalidSignature', inputs: [] },
    {
      type: 'error',
      name: 'ECDSAInvalidSignatureLength',
      inputs: [{ name: 'length', type: 'uint256', internalType: 'uint256' }]
    },
    {
      type: 'error',
      name: 'ECDSAInvalidSignatureS',
      inputs: [{ name: 's', type: 'bytes32', internalType: 'bytes32' }]
    },
    {
      type: 'error',
      name: 'OwnableInvalidOwner',
      inputs: [{ name: 'owner', type: 'address', internalType: 'address' }]
    },
    {
      type: 'error',
      name: 'OwnableUnauthorizedAccount',
      inputs: [{ name: 'account', type: 'address', internalType: 'address' }]
    },
    { type: 'error', name: 'Reentrancy', inputs: [] }
  ]
}

export default contract
