import { useEffect, useMemo, useState } from 'react'
import { Abi, Chain, createPublicClient, http } from 'viem'
import { Spin } from 'antd'

import CodattaGenesisPass from '@/contracts/codatta-genesis-pass.abi'
import CodattaBuildKeyEliteHunter from '@/contracts/codatta-build-key-elite-hunter.abi'
import CodattaBuildKeyMasterHunter from '@/contracts/codatta-build-key-master-hunter.abi'
import GoPlusSafuUniverse from '@/contracts/goplus-safu-universe.abi'

import NFTCardBg from '@/assets/settings/nft-card-bg.png'
import NFTCardBgLocked from '@/assets/settings/nft-card-bg-locked.png'

import NFTLockedImage from '@/assets/settings/locked.png'
import CodattaGenesisPassImage from '@/assets/settings/codatta-genesis-pass.png'
import BuildKeyEliteHunterImage from '@/assets/settings/buildkey-elite-hunter.png'
import BuildKeyMasterHunterImage from '@/assets/settings/buildkey-master-hunter.png'
import GoPlusSafuUniverseImage from '@/assets/settings/goplus-safu-universe.png'

import { useUserStore } from '@/stores/user.store'

export default function UserInfoNFT() {
  const { info } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [nft, setNft] = useState<{
    codattaGenesisPass: boolean
    codattaBuildKeyEliteHunter: boolean
    codattaBuildKeyMasterHunter: boolean
    goplusSafuUniverse: boolean
  }>({
    codattaGenesisPass: false,
    codattaBuildKeyEliteHunter: false,
    codattaBuildKeyMasterHunter: false,
    goplusSafuUniverse: false
  })

  async function checkOwnership(addresses: string[]) {
    if (!addresses?.length) return
    setLoading(true)
    const res = await Promise.all([
      checkUserNftOwnership(CodattaGenesisPass, addresses),
      checkUserNftOwnership(CodattaBuildKeyEliteHunter, addresses),
      checkUserNftOwnership(CodattaBuildKeyMasterHunter, addresses),
      checkUserNftOwnership(GoPlusSafuUniverse, addresses)
    ])
    setNft({
      codattaGenesisPass: res[0],
      codattaBuildKeyEliteHunter: res[1],
      codattaBuildKeyMasterHunter: res[2],
      goplusSafuUniverse: res[3]
    })
    setLoading(false)
  }

  const addresses = useMemo(() => {
    return info?.accounts_data
      .filter((item) => ['wallet', 'block_chain'].includes(item.account_type))
      .map((item) => item.account)
  }, [info])

  useEffect(() => {
    if (!addresses?.length) return
    checkOwnership(addresses)
  }, [addresses])

  return (
    <div>
      <h3 className="mb-6 flex items-center justify-between text-[32px] font-bold leading-[40px]">
        <span>NFT</span>
      </h3>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NFTCard
          title="Codatta Genesis Pass"
          description="Codatta Genesis Pass"
          image={CodattaGenesisPassImage}
          isOwned={nft.codattaGenesisPass}
          loading={loading}
        />
        <NFTCard
          title="Codatta Build Key Elite Hunter"
          description="Codatta Build Key Elite Hunter"
          image={BuildKeyEliteHunterImage}
          isOwned={nft.codattaBuildKeyEliteHunter}
          loading={loading}
        />
        <NFTCard
          title="Codatta Build Key Master Hunter"
          description="Codatta Build Key Master Hunter"
          image={BuildKeyMasterHunterImage}
          isOwned={nft.codattaBuildKeyMasterHunter}
          loading={loading}
        />
        <NFTCard
          title="GoPlus Safu Universe"
          description="GoPlus Safu Universe"
          image={GoPlusSafuUniverseImage}
          isOwned={nft.goplusSafuUniverse}
          loading={loading}
        />
      </div>
    </div>
  )
}

async function checkNftOwnership(contract: { abi: Abi; chain: Chain; address: string }, address: string) {
  const client = createPublicClient({
    chain: contract.chain,
    transport: http()
  })

  try {
    const balance = (await client.readContract({
      abi: contract.abi,
      address: contract.address as `0x${string}`,
      functionName: 'balanceOf',
      args: [address]
    })) as bigint

    return balance > 0n
  } catch {
    return false
  }
}

async function checkUserNftOwnership(contract: { abi: Abi; chain: Chain; address: string }, address: string[]) {
  const res = await Promise.all(address.map((item) => checkNftOwnership(contract, item)))
  return res.some((item) => item === true)
}

interface NFTCardProps {
  title: string
  description: string
  image: string
  isOwned: boolean
  loading: boolean
}

function NFTCard({ title, description, image, isOwned, loading }: NFTCardProps) {
  return (
    <Spin spinning={loading}>
      <div className="rounded-2xl bg-[#252532] p-6">
        <div
          className="mb-6 aspect-[342/186] rounded-2xl p-4 text-center"
          style={{
            backgroundImage: isOwned ? `url(${NFTCardBg})` : `url(${NFTCardBgLocked})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {isOwned && <img src={image} alt="" className="mb-3 inline-block h-full w-auto drop-shadow-xl" />}
          {!isOwned && <img src={NFTLockedImage} alt="" className="mb-3 inline-block h-full w-auto drop-shadow-xl" />}
          <div className="line-clamp-1 text-center text-sm font-semibold">{title}</div>
        </div>
        <div className="mt-6 text-base font-bold">{description}</div>
      </div>
    </Spin>
  )
}
