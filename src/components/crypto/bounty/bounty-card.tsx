import { BountyStatus, BountyType, TBounty } from '@/api-v1/bounty.api'
import Copy from '@/components/common/copy'
import { shortenAddress } from '@/utils/wallet-address'
import { AlarmClock } from 'lucide-react'
import CountDown from '@/components/common/countdown'
import { bountyStoreActions } from '@/stores/bounty.store'
import ReactGA from 'react-ga4'
import { useNavigate } from 'react-router'

interface TExtraInfo {
  [key: string]: string
}

export default function BountyCard(props: { bounty: TBounty; onShareClick?: (bounty: TBounty) => void }) {
  const { bounty } = props
  const type = bounty.address ? BountyType.Entity : BountyType.Address
  const status = bounty.status
  const taskId = bounty.hunting_entity_task_id || bounty.hunting_address_task_id

  let extraInfo: TExtraInfo
  try {
    extraInfo = JSON.parse(bounty.ext_info || '{}')
  } catch (err) {
    console.error(err)
    extraInfo = {}
  }
  const entityType = extraInfo.type
  const content = type === BountyType.Entity ? shortenAddress(bounty.address!) : bounty.entity
  const rowContent = type === BountyType.Entity ? bounty.address : bounty.entity
  const description = extraInfo.description || entityType
  const navigate = useNavigate()

  // function handleShareClick(e) {
  //   e.stopPropagation()
  //   onShareClick(bounty)
  // }

  function handleCardClick() {
    ReactGA.event('bounty_list_card_click', { customParams: JSON.stringify({ task_id: taskId }) })
    if (['InProgress', 'Completed'].includes(status)) {
      navigate(`/app/crypto/bounty/${taskId}/detail?type=${type}`)
      // window.open(`/app/bounty/${taskId}/detail?type=${type}`, '_blank')
    } else {
      navigate(`/app/crypto/bounty/${taskId}/submit?type=${type}`)
      // window.open(`/app/bounty/${taskId}/submit?type=${type}`, '_blank')
    }
  }

  return (
    <div
      className="block cursor-pointer overflow-hidden rounded-2xl border-gray-200 bg-gray-100 text-sm transition-all ease-in-out hover:border-primary hover:shadow-primary"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="mb-5 flex items-center">
          <span className="text-lg font-bold leading-10 text-primary">{bounty.points_every_voter} Points</span>
          {/* <img src="" alt="" className="ml-auto h-10 w-10 rounded-full bg-gray-200" /> */}
        </div>
        <div className="mb-1 flex items-center gap-1">
          <span>{content}</span>
          <div className="rounded-lg p-[6px] leading-none hover:bg-gray-200">
            <Copy content={rowContent}></Copy>
          </div>
        </div>

        <div className="relative flex items-center pr-8">
          <div className="line-clamp-1 text-gray-500">
            <span>{description}</span>
          </div>
          {/* <div className="rounded-2 absolute right-0 ml-auto shrink-0 p-1 hover:bg-gray-200" onClick={handleShareClick}>
            <ShareIcon size={20} />
          </div> */}
        </div>
      </div>

      {bounty.status === BountyStatus.OnHold && (
        <div className="flex items-center justify-center gap-2 bg-gray-200 py-3 font-bold">
          <AlarmClock size={14} />
          <CountDown gmt={bounty.gmt_expiration!} onTimeout={() => bountyStoreActions.reloadBountyList()} />
        </div>
      )}
    </div>
  )
}
