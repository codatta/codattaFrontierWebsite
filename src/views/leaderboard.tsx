import TopContribution from '@/components/leaderboard/top-contribution'
import TopReputation from '@/components/leaderboard/top-reputation'
import TransitionEffect from '@/components/common/transition-effect'
import SegmentSelector from '@/components/leaderboard/segment-selector'
import useTRankStore, { rankStoreActions } from '@/stores/rank.store'
import { useEffect, useState } from 'react'
// import styled from 'styled-components'
import { Spin, Button } from 'antd'
import { cn } from '@udecode/cn'
import { useNavigate } from 'react-router-dom'
import DescriptionImage from '@/components/leaderboard/description-image'

// const MainDiv = styled.div`
//   background: rgba(85, 0, 85, 0.012);
// `
enum SegmentType {
  Reputation = 'Reputation',
  Contributors = 'Contributors'
}

export default function LeaderboardPage() {
  const navigate = useNavigate()
  const { loading } = useTRankStore()
  const [activeSegment, setActiveSegment] = useState<string>(
    SegmentType.Contributors
  )

  function handleSegmentSelect(segment: string) {
    setActiveSegment(segment)
  }

  useEffect(() => {
    rankStoreActions.getRankData()
  }, [])

  return (
    <TransitionEffect className="box-border flex flex-col text-sm font-semibold">
      <DescriptionImage />
      <div className="min-w-[800px] flex-1">
        <Spin
          spinning={loading}
          wrapperClassName={
            '[&>.ant-spin-blur::after]:bg-transparent [&>div>.ant-spin]:min-h-full'
          }
        >
          <div className="relative w-full rounded-2xl bg-white/10 p-6 text-white">
            <div className="flex justify-between">
              <div>
                <SegmentSelector
                  defaultActive={activeSegment}
                  segments={[
                    {
                      type: SegmentType.Contributors,
                      text: 'Most Contributors'
                    },
                    { type: SegmentType.Reputation, text: 'Top Reputation' }
                  ]}
                  onSelect={handleSegmentSelect}
                />
              </div>
              {activeSegment === SegmentType.Reputation && (
                <Button
                  size="large"
                  className={cn(
                    'rounded-full border-solid border-white bg-transparent text-sm text-white'
                  )}
                  onClick={() => navigate('/settings/reputation')}
                >
                  Improve Reputation
                </Button>
              )}
              {activeSegment === SegmentType.Contributors && (
                <Button
                  size="large"
                  className="rounded-full border-solid border-white bg-transparent text-sm text-white"
                  onClick={() => navigate('/app/crypto')}
                >
                  Contribute More
                </Button>
              )}
            </div>
            <div className="flex items-start justify-center">
              {activeSegment === SegmentType.Reputation && <TopReputation />}
              {activeSegment === SegmentType.Contributors && (
                <TopContribution />
              )}
            </div>
          </div>
        </Spin>
      </div>
    </TransitionEffect>
  )
}
