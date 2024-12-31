import { Button } from 'antd'
import { useEffect } from 'react'

import TaskTarget from '@/components/common/task-target'
import CheckInModal from '@/components/checkin/checkin-modal'

import CheckSvg from '@/assets/icons/circle-check-big.svg'

import { useCheckinStore, toggleCheckinModal, checkinStoreActions } from '@/stores/checkin.store'

export default function Checkin() {
  const { days, done, loading } = useCheckinStore()

  useEffect(() => {
    checkinStoreActions.reloadCheckin()
  }, [])

  return (
    <div className="px-6">
      {done ? (
        <Button
          className="h-[44px] w-full gap-0 rounded-full bg-transparent p-0 text-sm font-medium leading-[44px] text-white [&:disabled]:border-white [&:disabled]:text-white"
          disabled={true}
        >
          <object data={CheckSvg} type="image/svg+xml" className="pointer-events-none mr-2 size-[22px]"></object>
          <span>Check In: {days}</span>
        </Button>
      ) : (
        <TaskTarget match={['target', 'check-in']}>
          <Button
            className="h-[44px] w-full gap-0 rounded-full p-0 text-sm font-medium leading-[44px]"
            type="primary"
            loading={loading}
            onClick={() => toggleCheckinModal(true)}
          >
            Check In
          </Button>
        </TaskTarget>
      )}
      <CheckInModal></CheckInModal>
    </div>
  )
}
