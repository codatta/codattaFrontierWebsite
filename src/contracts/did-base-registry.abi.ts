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

const CONTRACT_ADDRESS_TESTNET = '0xD57551f1c6397319f645236F5bc6aFa526A5a3b3' // TODO
const CONTRACT_ADDRESS_MAINNET = '0x' // TODO

const contract: { abi: Abi; chain: Chain; address: string } = {
  chain: import.meta.env.VITE_MODE === 'production' ? MAINNET : TESTNET,
  address: import.meta.env.VITE_MODE === 'production' ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET,
  abi: [
    { type: 'constructor', inputs: [], stateMutability: 'nonpayable' },
    {
      type: 'function',
      name: 'addController',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'operator', type: 'uint128', internalType: 'uint128' },
        { name: 'controller', type: 'uint128', internalType: 'uint128' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'addItemToAttribute',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'operator', type: 'uint128', internalType: 'uint128' },
        { name: 'name', type: 'string', internalType: 'string' },
        { name: 'value', type: 'bytes', internalType: 'bytes' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'controllersOf',
      inputs: [{ name: 'identifier', type: 'uint128', internalType: 'uint128' }],
      outputs: [{ name: 'controllers', type: 'uint128[]', internalType: 'uint128[]' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getDidDocument',
      inputs: [{ name: 'identifier', type: 'uint128', internalType: 'uint128' }],
      outputs: [
        { name: 'id', type: 'uint128', internalType: 'uint128' },
        { name: 'controller', type: 'uint128[]', internalType: 'uint128[]' },
        {
          name: 'kvAttributes',
          type: 'tuple[]',
          internalType: 'struct KvAttribute[]',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'value', type: 'bytes', internalType: 'bytes' }
          ]
        },
        {
          name: 'arrayAttributes',
          type: 'tuple[]',
          internalType: 'struct ArrayAttribute[]',
          components: [
            { name: 'name', type: 'string', internalType: 'string' },
            { name: 'values', type: 'bytes[]', internalType: 'bytes[]' }
          ]
        },
        { name: 'customAttributeNames', type: 'string[]', internalType: 'string[]' }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getOwnedDids',
      inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
      outputs: [{ name: 'identifiers', type: 'uint128[]', internalType: 'uint128[]' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getRegistrar',
      inputs: [],
      outputs: [{ name: 'registrar', type: 'address', internalType: 'address' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'ownerOf',
      inputs: [{ name: 'identifier', type: 'uint128', internalType: 'uint128' }],
      outputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'register',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'owner', type: 'address', internalType: 'address' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'revokeAttribute',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'operator', type: 'uint128', internalType: 'uint128' },
        { name: 'name', type: 'string', internalType: 'string' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'revokeController',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'operator', type: 'uint128', internalType: 'uint128' },
        { name: 'controller', type: 'uint128', internalType: 'uint128' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'revokeItemFromAttribute',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'operator', type: 'uint128', internalType: 'uint128' },
        { name: 'name', type: 'string', internalType: 'string' },
        { name: 'index', type: 'uint256', internalType: 'uint256' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'setAttribute',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'operator', type: 'uint128', internalType: 'uint128' },
        { name: 'name', type: 'string', internalType: 'string' },
        { name: 'value', type: 'bytes', internalType: 'bytes' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'transferOwner',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'to', type: 'address', internalType: 'address' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'event',
      name: 'DIDAttributeItemAdded',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'operator', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'name', type: 'string', indexed: false, internalType: 'string' },
        { name: 'index', type: 'uint256', indexed: false, internalType: 'uint256' },
        { name: 'value', type: 'bytes', indexed: false, internalType: 'bytes' }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'DIDAttributeItemRevoked',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'operator', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'name', type: 'string', indexed: false, internalType: 'string' },
        { name: 'index', type: 'uint256', indexed: false, internalType: 'uint256' }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'DIDAttributeRevoked',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'operator', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'name', type: 'string', indexed: false, internalType: 'string' }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'DIDAttributeSet',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'operator', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'name', type: 'string', indexed: false, internalType: 'string' },
        { name: 'value', type: 'bytes', indexed: false, internalType: 'bytes' }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'DIDControllerAdded',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'operator', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'controller', type: 'uint128', indexed: false, internalType: 'uint128' }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'DIDControllerRevoked',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'operator', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'controller', type: 'uint128', indexed: false, internalType: 'uint128' }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'DIDOwnerChanged',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'oldOwner', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'newOwner', type: 'address', indexed: false, internalType: 'address' }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'DIDRegistered',
      inputs: [
        { name: 'identifier', type: 'uint128', indexed: false, internalType: 'uint128' },
        { name: 'owner', type: 'address', indexed: false, internalType: 'address' }
      ],
      anonymous: false
    },
    {
      type: 'error',
      name: 'AttributeIndexNotExist',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'name', type: 'string', internalType: 'string' },
        { name: 'index', type: 'uint256', internalType: 'uint256' }
      ]
    },
    {
      type: 'error',
      name: 'ControllerNotFound',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'controller', type: 'uint128', internalType: 'uint128' }
      ]
    },
    {
      type: 'error',
      name: 'DIDAlreadyRegistered',
      inputs: [{ name: 'identifier', type: 'uint128', internalType: 'uint128' }]
    },
    {
      type: 'error',
      name: 'DuplicateController',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'controller', type: 'uint128', internalType: 'uint128' },
        { name: 'sender', type: 'address', internalType: 'address' }
      ]
    },
    {
      type: 'error',
      name: 'NotArrayAttribute',
      inputs: [{ name: 'name', type: 'string', internalType: 'string' }]
    },
    {
      type: 'error',
      name: 'NotController',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'controller', type: 'uint128', internalType: 'uint128' }
      ]
    },
    {
      type: 'error',
      name: 'NotKVAttribute',
      inputs: [{ name: 'name', type: 'string', internalType: 'string' }]
    },
    {
      type: 'error',
      name: 'NotOwnerOfController',
      inputs: [
        { name: 'identifier', type: 'uint128', internalType: 'uint128' },
        { name: 'controller', type: 'uint128', internalType: 'uint128' },
        { name: 'sender', type: 'address', internalType: 'address' }
      ]
    },
    {
      type: 'error',
      name: 'NotRegistrar',
      inputs: [{ name: 'account', type: 'address', internalType: 'address' }]
    }
  ]
}

export default contract
