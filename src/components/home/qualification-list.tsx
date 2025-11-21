import { Tag } from 'antd'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

import boosterApi, { TaskInfo } from '@/apis/booster.api'
import QualificationBgImage from '@/assets/frontier/home/qualification-bg.png'
import QualificationBgDarkImage from '@/assets/frontier/home/qualification-bg-dark.png'

export default function QualificationList({ task_ids = '' }: { task_ids?: string }) {
  const [qualification, setQualification] = useState<TaskInfo>()
  const getQualificationList = useCallback(async (task_ids: string) => {
    const res = await boosterApi.getSpecTaskInfos(task_ids)
    if (res.data?.length) {
      // setQualificationList(res.data) // TODO: supoort multiple qualifications
      setQualification(res.data[0])
    } else {
      setQualification(undefined)
    }
  }, [])

  useEffect(() => {
    if (task_ids) {
      getQualificationList(task_ids)
    }
  }, [getQualificationList, task_ids])

  if (!task_ids || !qualification) return null

  return (
    <ul
      className={`mb-6 space-y-3 rounded-2xl bg-cover`}
      style={{
        backgroundImage: `url(${qualification.status === 3 ? QualificationBgDarkImage : QualificationBgImage})`
      }}
    >
      <li className="flex items-center justify-between rounded-2xl p-8">
        <span className="text-xl font-bold text-white">Unlock tasks by completing verification!</span>
        {qualification.status === 0 ? (
          <Link
            className="flex h-[34px] w-[104px] items-center justify-center gap-[6px] rounded-full bg-white text-[#1C1C26] hover:text-[#1C1C26]"
            to={`/frontier/project/VERIFICATION/${qualification.task_id}`}
          >
            Start <ArrowRight size={14} color="#1C1C26" />
          </Link>
        ) : qualification.status === 1 ? (
          <Tag className="flex h-[34px] w-[104px] items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1C1C26]">
            Pending
          </Tag>
        ) : qualification.status === 2 ? (
          <Tag className="flex h-[34px] w-[104px] items-center justify-center rounded-full bg-gradient-to-b from-[#FFEA98] to-[#FCC800] text-sm font-semibold text-[#1C1C26]">
            Approved
          </Tag>
        ) : qualification.status === 3 ? (
          <Tag className="flex h-[34px] w-[104px] items-center justify-center rounded-full bg-white text-sm font-semibold text-[#D92B2B]">
            Not Passed
          </Tag>
        ) : null}
      </li>
    </ul>
  )
}
