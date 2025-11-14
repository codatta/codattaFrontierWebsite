import { Tag } from 'antd'
import { Link } from 'react-router-dom'
import { useCallback, useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'

import boosterApi, { TaskInfo } from '@/apis/booster.api'

export default function QualificationList({ task_ids = '' }: { task_ids?: string }) {
  const [qualificationList, setQualificationList] = useState<TaskInfo[]>([])
  const getQualificationList = useCallback(async (task_ids: string) => {
    const res = await boosterApi.getSpecTaskInfos(task_ids)
    if (res.data?.length) {
      // setQualificationList(res.data) // TODO: supoort multiple qualifications
      setQualificationList(res.data.slice(0, 1))
    } else {
      setQualificationList([])
    }
  }, [])

  useEffect(() => {
    getQualificationList(task_ids)
  }, [getQualificationList, task_ids])

  if (!task_ids || qualificationList.length === 0) return null

  return (
    <ul className="mb-6 space-y-3">
      {qualificationList?.map((item, index) => (
        <li
          key={'qualification-list-' + index}
          className="flex items-center justify-between rounded-2xl bg-[#252532] p-8"
        >
          <span className="text-xl font-bold text-white">Unlock tasks by completing verification!</span>
          {item.status === 0 ? (
            <Link
              className="flex h-[34px] w-[104px] items-center justify-center gap-[6px] rounded-full bg-white text-[#1C1C26] hover:text-[#1C1C26]"
              to={`/frontier/project/VERIFICATION/${item.task_id}`}
            >
              Start <ArrowRight size={14} color="#1C1C26" />
            </Link>
          ) : item.status === 1 ? (
            <Tag className="flex h-[34px] w-[104px] items-center justify-center rounded-full bg-white text-sm font-semibold text-[#1C1C26]">
              Pending
            </Tag>
          ) : item.status === 2 ? (
            <Tag className="flex h-[34px] w-[104px] items-center justify-center rounded-full bg-gradient-to-b from-[#FFEA98] to-[#FCC800] text-sm font-semibold text-[#1C1C26]">
              Approved
            </Tag>
          ) : item.status === 3 ? (
            <Tag className="flex h-[34px] w-[104px] items-center justify-center rounded-full bg-white text-sm font-semibold text-[#D92B2B]">
              Not Passed
            </Tag>
          ) : null}
        </li>
      ))}
    </ul>
  )
}
