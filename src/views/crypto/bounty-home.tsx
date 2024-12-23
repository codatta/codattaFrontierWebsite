import { BountyActivity, BountyFeature } from '@/api-v1/bounty.api'
import TransitionEffect from '@/components/common/transition-effect'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { bountyStore, bountyStoreActions } from '@/stores/bounty.store'
import { useSnapshot } from 'valtio'
import ReactGA from 'react-ga4'
import dayjs from 'dayjs'
import { Clock } from 'lucide-react'
import { ArrowLeft } from 'lucide-react'

function HuntingLevelCard(props: { feature: BountyFeature }) {
  const { feature } = props
  const navigate = useNavigate()

  function handleClick() {
    ReactGA.event('bounty_level_click', { customParams: JSON.stringify({ level: feature.level }) })
    navigate(`/app/crypto/bounty/list?title=${feature.title}&level=${feature.level}`)
  }

  return (
    <div
      className="cursor-pointer rounded-2xl border border-gray-100 bg-gray-100 p-4 transition-all hover:border-primary hover:shadow-primary"
      onClick={handleClick}
    >
      <div className="mb-8">
        <div className="inline-block rounded-lg bg-gray-200 p-3">
          <div className="size-6">
            <img src={feature.image} alt="" />
          </div>
        </div>
      </div>

      <div className="mb-4 flex w-full flex-col flex-wrap items-start gap-1">
        <div className="text-lg font-bold">{feature.title}</div>
        <div className="rounded-full bg-primary/25 px-3 py-0.5 text-sm font-semibold text-primary">
          {feature.points}
        </div>
      </div>

      <div className="mb-6 line-clamp-2 h-[42] text-white/45">{feature.desc}</div>

      <div className="flex items-center">
        <div className="flex items-center gap-1">
          <span>View More</span>
          <ArrowUpRight size={18} />
        </div>
        {/* <div className="ml-auto flex items-center gap-1">
          <Users size={18}></Users>
          <span>{feature.current_count}</span>
        </div> */}
      </div>
    </div>
  )
}

function HuntingActivityCard(props: { activity: BountyActivity }) {
  const { activity } = props
  const navigate = useNavigate()

  const extraQuery = useMemo(() => {
    if (!activity.ext_info) return ''
    return `&${activity.ext_info?.query_key}=${activity.ext_info?.query_value}`
  }, [activity])

  function handleClick() {
    ReactGA.event('bounty_activity_click', { customParams: JSON.stringify({ activity_id: activity.activity_id }) })
    navigate(`/app/crypto/bounty/list?type=${activity.type}&title=${activity.title}${extraQuery}`)
  }

  const displayTimeRange = useMemo(() => {
    const start = dayjs(activity.start_time)
    const end = dayjs(activity.end_time)
    return start.format('YYYY/MM/DD') + ' - ' + end.format('YYYY/MM/DD')
  }, [activity])

  return (
    <div
      className="cursor-pointer overflow-hidden rounded-2xl border-white/10 bg-white/10 transition-all hover:border-primary hover:shadow-primary"
      onClick={handleClick}
    >
      <div className="aspect-[346/120] overflow-hidden">
        <img className="block w-full" src={activity.image} alt="" />
      </div>

      <div className="p-4">
        <div className="mb-4 flex w-full flex-col flex-wrap items-start gap-1">
          <div className="text-lg font-bold">{activity.title}</div>
          <div className="rounded-full bg-primary/25 px-3 py-0.5 text-sm font-semibold text-primary">
            {activity.points}
          </div>
        </div>

        <div className="mb-6 line-clamp-2 h-[42px] text-gray-500">{activity.desc}</div>

        <div className="flex items-center">
          <div className="flex items-center gap-1">
            <Clock size={18} />
            <span>{displayTimeRange}</span>
          </div>
          {/* <div className="ml-auto flex items-center gap-1">
      <Users size={18}></Users>
      <span>{feature.current_count}</span>
    </div> */}
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  const { features, activities } = useSnapshot(bountyStore)
  const navigate = useNavigate()

  useEffect(() => {
    bountyStoreActions.getFeatures()
  }, [])

  return (
    <TransitionEffect className="">
      <div className="mb-6 flex items-center gap-2">
        <ArrowLeft size={36} onClick={() => navigate(-1)} className="mr-2 cursor-pointer" />
        <h1 className="text-2xl font-bold">Professional submission</h1>
      </div>
      {activities.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-xl font-bold">Activity</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
            {activities.map((item) => {
              return <HuntingActivityCard activity={item}></HuntingActivityCard>
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-3 text-xl font-bold">Experience</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          {features.map((item) => {
            return <HuntingLevelCard feature={item}></HuntingLevelCard>
          })}
        </div>
      </div>
    </TransitionEffect>
  )
}
