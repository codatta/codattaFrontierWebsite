import { Abi, Chain, defineChain } from 'viem'
import { base, bsc } from 'viem/chains'

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

const CONTRACT_ADDRESS_TESTNET = '0x18AFe7516802C05661672a5CB1F9f8034042A305'
const CONTRACT_ADDRESS_MAINNET = '0xd0A4950C096daC5Ae5A0f74Ff3eE316d74558974'

export const contract: { abi: Abi; chain: Chain; address: string } = {
  chain: import.meta.env.VITE_MODE === 'production' ? MAINNET : TESTNET,
  address: import.meta.env.VITE_MODE === 'production' ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET,
  abi: [
    {
      type: 'constructor',
      inputs: [
        {
          name: '_owner',
          type: 'address',
          internalType: 'address'
        },
        {
          name: '_submitter',
          type: 'address',
          internalType: 'address'
        }
      ],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'batchSubmit',
      inputs: [
        {
          name: 'users',
          type: 'address[]',
          internalType: 'address[]'
        },
        {
          name: 'records',
          type: 'tuple[]',
          internalType: 'struct SubmissionDataFingerprints.Record[]',
          components: [
            {
              name: 'submissionId',
              type: 'uint256',
              internalType: 'uint256'
            },
            {
              name: 'fingerPrint',
              type: 'bytes32',
              internalType: 'bytes32'
            }
          ]
        }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'getUserRecordBySubmissionId',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        },
        {
          name: 'submissionId',
          type: 'uint256',
          internalType: 'uint256'
        },
        {
          name: 'page',
          type: 'uint256',
          internalType: 'uint256'
        },
        {
          name: 'size',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      outputs: [
        {
          name: 'found',
          type: 'bool',
          internalType: 'bool'
        },
        {
          name: 'record',
          type: 'tuple',
          internalType: 'struct SubmissionDataFingerprints.Record',
          components: [
            {
              name: 'submissionId',
              type: 'uint256',
              internalType: 'uint256'
            },
            {
              name: 'fingerPrint',
              type: 'bytes32',
              internalType: 'bytes32'
            }
          ]
        },
        {
          name: 'end',
          type: 'bool',
          internalType: 'bool'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getUserRecordCount',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        }
      ],
      outputs: [
        {
          name: 'count',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getUserRecords',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        },
        {
          name: 'page',
          type: 'uint256',
          internalType: 'uint256'
        },
        {
          name: 'size',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      outputs: [
        {
          name: 'rets',
          type: 'tuple[]',
          internalType: 'struct SubmissionDataFingerprints.Record[]',
          components: [
            {
              name: 'submissionId',
              type: 'uint256',
              internalType: 'uint256'
            },
            {
              name: 'fingerPrint',
              type: 'bytes32',
              internalType: 'bytes32'
            }
          ]
        },
        {
          name: 'end',
          type: 'bool',
          internalType: 'bool'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'owner',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address'
        }
      ],
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
      name: 'setSubmitter',
      inputs: [
        {
          name: '_submitter',
          type: 'address',
          internalType: 'address'
        }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'submit',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        },
        {
          name: 'record',
          type: 'tuple',
          internalType: 'struct SubmissionDataFingerprints.Record',
          components: [
            {
              name: 'submissionId',
              type: 'uint256',
              internalType: 'uint256'
            },
            {
              name: 'fingerPrint',
              type: 'bytes32',
              internalType: 'bytes32'
            }
          ]
        }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'submitter',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'transferOwnership',
      inputs: [
        {
          name: 'newOwner',
          type: 'address',
          internalType: 'address'
        }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
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
      name: 'SubmissionDataSubmitted',
      inputs: [
        {
          name: 'user',
          type: 'address',
          indexed: false,
          internalType: 'address'
        },
        {
          name: 'submissionId',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256'
        },
        {
          name: 'fingerprint',
          type: 'bytes32',
          indexed: false,
          internalType: 'bytes32'
        }
      ],
      anonymous: false
    },
    {
      type: 'error',
      name: 'NotSubmitter',
      inputs: [
        {
          name: 'account',
          type: 'address',
          internalType: 'address'
        }
      ]
    },
    {
      type: 'error',
      name: 'OwnableInvalidOwner',
      inputs: [
        {
          name: 'owner',
          type: 'address',
          internalType: 'address'
        }
      ]
    },
    {
      type: 'error',
      name: 'OwnableUnauthorizedAccount',
      inputs: [
        {
          name: 'account',
          type: 'address',
          internalType: 'address'
        }
      ]
    },
    {
      type: 'error',
      name: 'ParameterLengthNotEqual',
      inputs: [
        {
          name: 'lengthOfUsers',
          type: 'uint256',
          internalType: 'uint256'
        },
        {
          name: 'lengthOfRecords',
          type: 'uint256',
          internalType: 'uint256'
        }
      ]
    }
  ]
}
