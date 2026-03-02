import { useEffect } from 'react'

import CheckInModal from '@/components/checkin/checkin-modal'
import checkinIcon from '@/assets/userinfo/checkin-btn.png'

import { useCheckinStore, toggleCheckinModal, checkinStoreActions } from '@/stores/checkin.store'

export default function Checkin({ className }: { className?: string }) {
  const { done } = useCheckinStore()

  useEffect(() => {
    checkinStoreActions.reloadCheckin()
  }, [])

  return (
    <div className={className}>
      <img
        src={checkinIcon}
        className={`block size-[54px] ${done ? 'cursor-not-allowed opacity-50 grayscale' : 'cursor-pointer'}`}
        onClick={done ? undefined : () => toggleCheckinModal(true)}
      />
      <CheckInModal />
    </div>
  )
}
