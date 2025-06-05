import { Abi, Chain, defineChain } from 'viem'

const TESTNET = defineChain({
  id: 2368,
  name: 'KiteAI Testnet',
  nativeCurrency: {
    name: 'KITE',
    symbol: 'KITE',
    decimals: 18
  },
  rpcUrls: { default: { http: ['https://rpc-testnet.gokite.ai'] } }
})

const MAINNET = defineChain({
  id: 2368,
  name: 'KiteAI Testnet',
  nativeCurrency: {
    name: 'KITE',
    symbol: 'KITE',
    decimals: 18
  },
  rpcUrls: { default: { http: ['https://rpc-testnet.gokite.ai'] } }
})

const CONTRACT_ADDRESS_TESTNET = '0xBD763639297123AB22Ff19Fe08BbD3361a53E8E1'
const CONTRACT_ADDRESS_MAINNET = ''

const contract: { abi: Abi; chain: Chain; address: string } = {
  chain: import.meta.env.VITE_MODE === 'production' ? MAINNET : TESTNET,
  address: import.meta.env.VITE_MODE === 'production' ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET,
  abi: [
    {
      type: 'constructor',
      inputs: [
        { name: 'name_', type: 'string', internalType: 'string' },
        { name: 'symbol_', type: 'string', internalType: 'string' },
        { name: 'baseURI_', type: 'string', internalType: 'string' }
      ],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'addMinter',
      inputs: [{ name: 'minter_', type: 'address', internalType: 'address' }],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'balanceOf',
      inputs: [
        { name: 'account', type: 'address', internalType: 'address' },
        { name: 'id', type: 'uint256', internalType: 'uint256' }
      ],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'balanceOfBatch',
      inputs: [
        {
          name: 'accounts',
          type: 'address[]',
          internalType: 'address[]'
        },
        { name: 'ids', type: 'uint256[]', internalType: 'uint256[]' }
      ],
      outputs: [{ name: '', type: 'uint256[]', internalType: 'uint256[]' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'burn',
      inputs: [
        { name: 'account', type: 'address', internalType: 'address' },
        { name: 'id', type: 'uint256', internalType: 'uint256' },
        { name: 'value', type: 'uint256', internalType: 'uint256' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'createSoul',
      inputs: [
        { name: 'soulName', type: 'string', internalType: 'string' },
        { name: 'description', type: 'string', internalType: 'string' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'exists',
      inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getSoulName',
      inputs: [{ name: 'soulId', type: 'uint256', internalType: 'uint256' }],
      outputs: [{ name: '', type: 'string', internalType: 'string' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'isApprovedForAll',
      inputs: [
        { name: 'account', type: 'address', internalType: 'address' },
        { name: 'operator', type: 'address', internalType: 'address' }
      ],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'isCreated',
      inputs: [{ name: 'soulId', type: 'uint256', internalType: 'uint256' }],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'isMinter',
      inputs: [{ name: 'minter_', type: 'address', internalType: 'address' }],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'latestUnusedTokenId',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'mint',
      inputs: [
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'soulId', type: 'uint256', internalType: 'uint256' },
        { name: 'expiresAt', type: 'uint256', internalType: 'uint256' },
        { name: 'signature', type: 'bytes', internalType: 'bytes' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'mintByMinter',
      inputs: [
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'soulId', type: 'uint256', internalType: 'uint256' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'name',
      inputs: [],
      outputs: [{ name: '', type: 'string', internalType: 'string' }],
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
      name: 'pause',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'paused',
      inputs: [],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'removeMinter',
      inputs: [{ name: 'minter_', type: 'address', internalType: 'address' }],
      outputs: [],
      stateMutability: 'nonpayable'
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
      name: 'safeBatchTransferFrom',
      inputs: [
        { name: 'from', type: 'address', internalType: 'address' },
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'ids', type: 'uint256[]', internalType: 'uint256[]' },
        { name: 'values', type: 'uint256[]', internalType: 'uint256[]' },
        { name: 'data', type: 'bytes', internalType: 'bytes' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'safeTransferFrom',
      inputs: [
        { name: 'from', type: 'address', internalType: 'address' },
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'id', type: 'uint256', internalType: 'uint256' },
        { name: 'value', type: 'uint256', internalType: 'uint256' },
        { name: 'data', type: 'bytes', internalType: 'bytes' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'setApprovalForAll',
      inputs: [
        { name: 'operator', type: 'address', internalType: 'address' },
        { name: 'approved', type: 'bool', internalType: 'bool' }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'setSigner',
      inputs: [{ name: 'newSigner', type: 'address', internalType: 'address' }],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'setbaseURI',
      inputs: [{ name: 'baseURI_', type: 'string', internalType: 'string' }],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'soulIdToSoulContainer',
      inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      outputs: [
        { name: 'soulName', type: 'string', internalType: 'string' },
        { name: 'description', type: 'string', internalType: 'string' },
        {
          name: 'registeredTimestamp',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'supportsInterface',
      inputs: [{ name: 'interfaceId', type: 'bytes4', internalType: 'bytes4' }],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'symbol',
      inputs: [],
      outputs: [{ name: '', type: 'string', internalType: 'string' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'totalSupply',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'totalSupply',
      inputs: [{ name: 'id', type: 'uint256', internalType: 'uint256' }],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
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
      name: 'unpause',
      inputs: [],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'uri',
      inputs: [{ name: 'soulId', type: 'uint256', internalType: 'uint256' }],
      outputs: [{ name: '', type: 'string', internalType: 'string' }],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'verifySignature',
      inputs: [
        { name: 'to', type: 'address', internalType: 'address' },
        { name: 'soulId', type: 'uint256', internalType: 'uint256' },
        { name: 'expiresAt', type: 'uint256', internalType: 'uint256' },
        { name: 'signature', type: 'bytes', internalType: 'bytes' }
      ],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'pure'
    },
    {
      type: 'event',
      name: 'ApprovalForAll',
      inputs: [
        {
          name: 'account',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'operator',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'approved',
          type: 'bool',
          indexed: false,
          internalType: 'bool'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'MinterAdded',
      inputs: [
        {
          name: 'newMinter',
          type: 'address',
          indexed: true,
          internalType: 'address'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'MinterRemoved',
      inputs: [
        {
          name: 'oldMinter',
          type: 'address',
          indexed: true,
          internalType: 'address'
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
    {
      type: 'event',
      name: 'Paused',
      inputs: [
        {
          name: 'account',
          type: 'address',
          indexed: false,
          internalType: 'address'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'SignerChanged',
      inputs: [
        {
          name: 'oldSigner',
          type: 'address',
          indexed: false,
          internalType: 'address'
        },
        {
          name: 'newSigner',
          type: 'address',
          indexed: false,
          internalType: 'address'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'SoulCreated',
      inputs: [
        {
          name: 'soulId',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256'
        },
        {
          name: 'soulName',
          type: 'string',
          indexed: false,
          internalType: 'string'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'TransferBatch',
      inputs: [
        {
          name: 'operator',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'from',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'to',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'ids',
          type: 'uint256[]',
          indexed: false,
          internalType: 'uint256[]'
        },
        {
          name: 'values',
          type: 'uint256[]',
          indexed: false,
          internalType: 'uint256[]'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'TransferSingle',
      inputs: [
        {
          name: 'operator',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'from',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'to',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'id',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256'
        },
        {
          name: 'value',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'URI',
      inputs: [
        {
          name: 'value',
          type: 'string',
          indexed: false,
          internalType: 'string'
        },
        {
          name: 'id',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'Unpaused',
      inputs: [
        {
          name: 'account',
          type: 'address',
          indexed: false,
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
      name: 'ERC1155InsufficientBalance',
      inputs: [
        { name: 'sender', type: 'address', internalType: 'address' },
        { name: 'balance', type: 'uint256', internalType: 'uint256' },
        { name: 'needed', type: 'uint256', internalType: 'uint256' },
        { name: 'tokenId', type: 'uint256', internalType: 'uint256' }
      ]
    },
    {
      type: 'error',
      name: 'ERC1155InvalidApprover',
      inputs: [{ name: 'approver', type: 'address', internalType: 'address' }]
    },
    {
      type: 'error',
      name: 'ERC1155InvalidArrayLength',
      inputs: [
        { name: 'idsLength', type: 'uint256', internalType: 'uint256' },
        { name: 'valuesLength', type: 'uint256', internalType: 'uint256' }
      ]
    },
    {
      type: 'error',
      name: 'ERC1155InvalidOperator',
      inputs: [{ name: 'operator', type: 'address', internalType: 'address' }]
    },
    {
      type: 'error',
      name: 'ERC1155InvalidReceiver',
      inputs: [{ name: 'receiver', type: 'address', internalType: 'address' }]
    },
    {
      type: 'error',
      name: 'ERC1155InvalidSender',
      inputs: [{ name: 'sender', type: 'address', internalType: 'address' }]
    },
    {
      type: 'error',
      name: 'ERC1155MissingApprovalForAll',
      inputs: [
        { name: 'operator', type: 'address', internalType: 'address' },
        { name: 'owner', type: 'address', internalType: 'address' }
      ]
    },
    { type: 'error', name: 'EnforcedPause', inputs: [] },
    { type: 'error', name: 'ExpectedPause', inputs: [] },
    { type: 'error', name: 'InvalidSignature', inputs: [] },
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
    { type: 'error', name: 'SignatureExpired', inputs: [] },
    {
      type: 'error',
      name: 'SoulAlreadyMinted',
      inputs: [{ name: 'to', type: 'address', internalType: 'address' }]
    },
    {
      type: 'error',
      name: 'SoulIdNotCreated',
      inputs: [{ name: 'soulId', type: 'uint256', internalType: 'uint256' }]
    },
    { type: 'error', name: 'Unauthorized', inputs: [] }
  ]
}

export default contract
