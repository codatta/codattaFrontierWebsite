import { shortenAddress } from '@/utils/wallet-address'
import { cn } from '@udecode/cn'
import { Button, Col, Popover, Row, Tag, Tooltip } from 'antd'
import ReactGa from 'react-ga4'
import SubmissionProgressCompact from './submission-progress-compact'
import { useMemo } from 'react'
import { TReward, TSubmissionItem } from '@/api-v1/submission.api'
function WalletAddress(props: {
  address: string
  network: string
  date: number
  huningId: string
  className?: string
  category?: string
}) {
  const { address, className, network, huningId, category } = props

  const display_category = useMemo(() => {
    if (!category) return ''
    return category.split(',').join(', ')
  }, [category])

  const categoryList = useMemo(() => {
    if (!category) return []
    return category.split(',')
  }, [category])

  return (
    <>
      <Popover
        placement="top"
        content={
          <div onClick={(e) => e.stopPropagation()} className="max-w-[360px]">
            <div className="mb-4">
              <h2 className="mb-1 font-medium text-gray-500">Network</h2>
              <div>{network}</div>
            </div>
            <div className="mb-4">
              <h2 className="mb-1 font-medium text-gray-500">Address</h2>
              <div>{address}</div>
            </div>
            <div>
              <h2 className="mb-1 font-medium text-gray-500">Category</h2>
              <div className="flex flex-wrap gap-2"></div>
              {categoryList.map((item) => {
                return (
                  <Tag className="my-1" key={item}>
                    {item}
                  </Tag>
                )
              })}
            </div>
          </div>
        }
      >
        <div className="mb-1 flex items-center gap-2">
          <span className={`${className} font-semibold leading-[23px]`}>{shortenAddress(address)}</span>
          <span
            className={`flex h-[23px] items-center justify-center rounded-2xl bg-[rgba(48,0,64,0.06)] px-2 text-xs text-gray-600 ${className}`}
          >
            {network}
          </span>
          {huningId && (
            <Tooltip title={<span className="text-sm">Bounty Hunting</span>}>
              <div className="flex size-[23px] shrink-0 grow-0 items-center justify-center rounded-[4px] bg-[rgba(255,160,1,0.15)] text-xs text-[rgba(255,160,1,1)]">
                B
              </div>
            </Tooltip>
          )}
        </div>
        <div className="truncate text-sm leading-[17px]">{display_category}</div>
      </Popover>
    </>
  )
}

function Entity(props: { Entity: string }) {
  const { Entity } = props
  return (
    <>
      <div className="mb-2 text-xs leading-5">Entity</div>
      <div className="text-sm font-semibold leading-5">{Entity}</div>
    </>
  )
}

function Reward(props: { reward: TReward; status: string }) {
  const { reward } = props

  // const { stage_1, stage_2, stage_3, stage_4 } = reward
  // const total = [stage_1, stage_2, stage_3, stage_4].reduce((acc, cur) => acc + (cur?.completed ? cur.point : 0), 0)
  const total = reward.total_point || 0
  // const color = status == 'Completed' ? 'text-#008573' : 'text-[rgba(4,0,17,0.61)]'
  // const isCompleted = status == 'Completed'

  return (
    <div>
      <div className="mb-2 text-xs leading-5">Reward</div>
      <div
        className={cn(
          `text-12px font-600 p-x-8px bg-opacity-24 whitespace-nowrap rounded-full bg-primary text-primary`,
          total === 0 && 'bg-gray-200 text-gray-300'
        )}
      >
        {total} {total > 1 ? 'points' : 'point'}
      </div>
    </div>
  )
}

export default function SubmissionItem(props: {
  submission: TSubmissionItem
  compact?: boolean
  onClick?: (item: TSubmissionItem) => void
}) {
  const { submission, compact, onClick } = props
  return (
    <Row
      onClick={() => onClick && onClick(submission)}
      className="flex justify-between border-b border-b-[rgba(48,0,64,0.06)] bg-gray-100 px-6 py-4 transition-all hover:bg-gray-200"
    >
      <Col span={8} className="overflow-hidden">
        <WalletAddress
          address={submission.address}
          network={submission.network}
          date={submission.gmt_create}
          huningId={submission.hunting_id}
          category={submission.category}
        ></WalletAddress>
      </Col>
      {/* <Col span={3}>
        <Category category={submission.category}></Category>
      </Col> */}
      <Col span={3}>
        <Entity Entity={submission.entity}></Entity>
      </Col>
      {!compact ? (
        <Col span={4} className="flex flex-col items-start">
          <div className="mb-2 text-xs leading-5">Progress</div>
          <SubmissionProgressCompact reward={submission.reward}></SubmissionProgressCompact>
        </Col>
      ) : null}
      <Col span={4} className="flex justify-start">
        <Reward reward={submission.reward} status={submission.status}></Reward>
      </Col>
      {!compact ? (
        <Col className="self-center sm:hidden md:hidden lg:hidden xl:block" span={2}>
          <Button
            onClick={() => {
              ReactGa.event('submission_detail')
            }}
          >
            Details
          </Button>
        </Col>
      ) : null}
    </Row>
  )
}
