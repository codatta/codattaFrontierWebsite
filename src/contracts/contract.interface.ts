import { Abi, Chain } from 'viem'

export default interface SmartContract {
  abi: Abi
  chain: Chain
  address: string
}
