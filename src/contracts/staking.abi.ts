import { Abi, Chain } from 'viem'
import { baseSepolia, bsc } from 'viem/chains'

const MAINNET = bsc

const CONTRACT_ADDRESS_TESTNET = '0x8e96C14CBC2f898652BD582D70EFF04f6089C478'
const CONTRACT_ADDRESS_MAINNET = ''

export const STAKE_ASSET_TYPE = import.meta.env.VITE_MODE === 'production' ? 'XNY' : 'SepoliaETH'
export const STAKE_TOKEN_ADRRESS =
  import.meta.env.VITE_MODE === 'production'
    ? '0xE3225e11Cab122F1a126A28997788E5230838ab9'
    : '0xe9fC6F3CcD332e84054D8Afd148ecE66BF18C2bA'

const contract: { abi: Abi; chain: Chain; address: string } = {
  chain: import.meta.env.VITE_MODE === 'production' ? MAINNET : baseSepolia,
  address: import.meta.env.VITE_MODE === 'production' ? CONTRACT_ADDRESS_MAINNET : CONTRACT_ADDRESS_TESTNET,
  abi: [
    {
      type: 'function',
      name: 'UNLOCK_PERIOD',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getTotalStaked',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getUserActivePositions',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        },
        {
          name: 'offset',
          type: 'uint256',
          internalType: 'uint256'
        },
        {
          name: 'limit',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'tuple[]',
          internalType: 'struct ILockedStaking.PositionEntry[]',
          components: [
            {
              name: 'positionId',
              type: 'bytes32',
              internalType: 'bytes32'
            },
            {
              name: 'amount',
              type: 'uint128',
              internalType: 'uint128'
            },
            {
              name: 'startTime',
              type: 'uint64',
              internalType: 'uint64'
            },
            {
              name: 'unlockTime',
              type: 'uint64',
              internalType: 'uint64'
            }
          ]
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getUserActivePositionsCount',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getUserUnstakingPositions',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        },
        {
          name: 'offset',
          type: 'uint256',
          internalType: 'uint256'
        },
        {
          name: 'limit',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'tuple[]',
          internalType: 'struct ILockedStaking.PositionEntry[]',
          components: [
            {
              name: 'positionId',
              type: 'bytes32',
              internalType: 'bytes32'
            },
            {
              name: 'amount',
              type: 'uint128',
              internalType: 'uint128'
            },
            {
              name: 'startTime',
              type: 'uint64',
              internalType: 'uint64'
            },
            {
              name: 'unlockTime',
              type: 'uint64',
              internalType: 'uint64'
            }
          ]
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getUserUnstakingPositionsCount',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'getWithdrawableAmount',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        }
      ],
      outputs: [
        {
          name: 'amount',
          type: 'uint256',
          internalType: 'uint256'
        },
        {
          name: 'positionIds',
          type: 'bytes32[]',
          internalType: 'bytes32[]'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'isStakingPosition',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        },
        {
          name: 'positionId',
          type: 'bytes32',
          internalType: 'bytes32'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          internalType: 'bool'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'isUnstakingPosition',
      inputs: [
        {
          name: 'user',
          type: 'address',
          internalType: 'address'
        },
        {
          name: 'positionId',
          type: 'bytes32',
          internalType: 'bytes32'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'bool',
          internalType: 'bool'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'positions',
      inputs: [
        {
          name: '',
          type: 'bytes32',
          internalType: 'bytes32'
        }
      ],
      outputs: [
        {
          name: 'amount',
          type: 'uint128',
          internalType: 'uint128'
        },
        {
          name: 'startTime',
          type: 'uint64',
          internalType: 'uint64'
        },
        {
          name: 'unlockTime',
          type: 'uint64',
          internalType: 'uint64'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'stake',
      inputs: [
        {
          name: 'positionId',
          type: 'bytes32',
          internalType: 'bytes32'
        },
        {
          name: 'amount',
          type: 'uint128',
          internalType: 'uint128'
        }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'stakingToken',
      inputs: [],
      outputs: [
        {
          name: '',
          type: 'address',
          internalType: 'contract IERC20'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'unstake',
      inputs: [
        {
          name: 'positionIds',
          type: 'bytes32[]',
          internalType: 'bytes32[]'
        }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'function',
      name: 'userTotalStaked',
      inputs: [
        {
          name: '',
          type: 'address',
          internalType: 'address'
        }
      ],
      outputs: [
        {
          name: '',
          type: 'uint256',
          internalType: 'uint256'
        }
      ],
      stateMutability: 'view'
    },
    {
      type: 'function',
      name: 'withdraw',
      inputs: [
        {
          name: 'positionIds',
          type: 'bytes32[]',
          internalType: 'bytes32[]'
        }
      ],
      outputs: [],
      stateMutability: 'nonpayable'
    },
    {
      type: 'event',
      name: 'Staked',
      inputs: [
        {
          name: 'positionId',
          type: 'bytes32',
          indexed: true,
          internalType: 'bytes32'
        },
        {
          name: 'user',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'amount',
          type: 'uint128',
          indexed: false,
          internalType: 'uint128'
        },
        {
          name: 'startTime',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'Unstake',
      inputs: [
        {
          name: 'positionId',
          type: 'bytes32',
          indexed: true,
          internalType: 'bytes32'
        },
        {
          name: 'user',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'unlockTime',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64'
        }
      ],
      anonymous: false
    },
    {
      type: 'event',
      name: 'Withdrawn',
      inputs: [
        {
          name: 'positionId',
          type: 'bytes32',
          indexed: true,
          internalType: 'bytes32'
        },
        {
          name: 'user',
          type: 'address',
          indexed: true,
          internalType: 'address'
        },
        {
          name: 'amount',
          type: 'uint128',
          indexed: false,
          internalType: 'uint128'
        }
      ],
      anonymous: false
    },
    {
      type: 'error',
      name: 'CanNotBeStakingToken',
      inputs: []
    },
    {
      type: 'error',
      name: 'EnforcedPause',
      inputs: []
    },
    {
      type: 'error',
      name: 'ExpectedPause',
      inputs: []
    },
    {
      type: 'error',
      name: 'InvalidAmount',
      inputs: []
    },
    {
      type: 'error',
      name: 'InvalidPositionStatus',
      inputs: []
    },
    {
      type: 'error',
      name: 'InvalidUnlockPeriod',
      inputs: []
    },
    {
      type: 'error',
      name: 'NotPositionOwner',
      inputs: []
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
      name: 'PositionAlreadyExists',
      inputs: []
    },
    {
      type: 'error',
      name: 'SafeERC20FailedOperation',
      inputs: [
        {
          name: 'token',
          type: 'address',
          internalType: 'address'
        }
      ]
    },
    {
      type: 'error',
      name: 'UnlockPeriodNotReached',
      inputs: []
    }
  ]
}

export default contract
