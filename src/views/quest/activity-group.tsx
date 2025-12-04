import type { ActivitySummary } from '@/apis/task.api'
import { activity, reloadActivities } from '@/stores/activity.store'
import { Avatar, Badge, Button, Flex, Image, Spin, Col, Row } from 'antd'
import { Ellipsis } from 'lucide-react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSnapshot } from 'valtio'
import { cn } from '@udecode/cn'

import ImageQuestLocked from '@/assets/task/quest-locked.png'
import TransitionEffect from '@/components/common/transition-effect'

export default function Component() {
  const { groups: activityGroups } = useSnapshot(activity)

  useEffect(() => {
    reloadActivities()
  }, [])

  if (!activityGroups?.length) return <Spin className="flex min-h-screen w-full items-center justify-center py-10" />

  return (
    <TransitionEffect className="">
      <h1 className="mb-6 text-[32px] font-semibold leading-8">Quest</h1>
      <Flex vertical gap={40} component="ul">
        {activityGroups &&
          activityGroups.map((group) => (
            <li key={group.cate_id}>
              <h2 className="mb-4 font-mona text-xl font-bold leading-normal first-letter:uppercase">
                {group.cate_name}
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {group.sub.map((activitySummary) => (
                  <ActivityCard
                    summary={activitySummary as Readonly<ActivitySummary>}
                    key={activitySummary.sub_cate_id}
                  />
                ))}
              </div>
            </li>
          ))}
      </Flex>
    </TransitionEffect>
  )
}

const ActivityCard = ({ summary: activity }: { summary: ActivitySummary }) => {
  const highLight = activity.sub_cate_id === 'SUBCATE010'
  return (
    <Link to={'/app/quest/' + activity.sub_cate_id}>
      <div
        className={cn(
          `hover:shadow relative h-full rounded-2xl border border-gray-50 bg-gray-50 px-6 pb-3 pt-6 transition-all hover:border hover:border-primary`,
          highLight ? 'bg-primary hover:border-white' : ''
        )}
      >
        <div className="aspect-[300/186] overflow-hidden rounded-2xl bg-transparent">
          <Image
            src={activity.locked ? ImageQuestLocked : activity.award_icon}
            preview={false}
            rootClassName="w-full"
          />
        </div>
        <div className="mb-8 mt-6 line-clamp-2 h-[60px] text-xl font-bold leading-[30px]">{activity.sub_cate_name}</div>
        <Row gutter={48} justify="space-between" wrap={true}>
          <Col flex={1}>
            <Button
              disabled={activity.locked}
              type="primary"
              size="large"
              className={cn(
                'mb-3 flex items-center justify-between rounded-[36px] font-medium',
                highLight ? 'bg-white text-gray' : ''
              )}
              block
            >
              <Badge count={activity.finished_count} className="invisible" size="small"></Badge>
              Win Rewards
              <Badge
                count={activity.finished_count}
                size="small"
                className="[&_.ant-badge-count]:[box-shadow:none]"
                style={{
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </Button>
          </Col>
          <Col className="max-w-[50%]">
            <Flex vertical gap={6} align="center" wrap>
              <div>
                <Avatar.Group>
                  {activity.avatars?.slice(0, 3).map((src: string, index: number) => (
                    <Avatar
                      key={index}
                      src={src}
                      size={24}
                      style={{
                        background: '#333',
                        border: '1px solid #DDD'
                      }}
                    />
                  ))}
                  <Avatar
                    icon={<Ellipsis color="#727272" />}
                    size={24}
                    style={{ background: '#444', border: '1px solid #555' }}
                  />
                </Avatar.Group>
                <div className={cn('whitespace-nowrap pb-1 text-xs', highLight ? 'text-gray-700' : '')}>
                  {activity.completed_count} completed
                </div>
              </div>
            </Flex>
          </Col>
        </Row>
      </div>
    </Link>
  )
}
