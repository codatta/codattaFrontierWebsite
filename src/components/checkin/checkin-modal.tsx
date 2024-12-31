import { Modal } from 'antd'

import calendarIcon from '@/assets/checkin/calendar.png'

import AnimateContainer from '@/components/common/animate-container'
import CalenderView from './calender-view'

import { toggleCheckinModal, useCheckinStore } from '@/stores/checkin.store'

export default function CheckInModal() {
  const { show } = useCheckinStore()

  return (
    <>
      <Modal
        title=""
        width={640}
        className="rounded-3xl bg-gray [&_.ant-modal-content]:p-0"
        closable={false}
        footer={null}
        centered
        open={show}
        onCancel={() => toggleCheckinModal(false)}
      >
        <div className="relative">
          <AnimateContainer>
            <CalenderView />
          </AnimateContainer>
          <img
            className="absolute right-[-50px] top-[-80px] h-[160px] rotate-12 drop-shadow-[2px_3px_8px_rgba(55,18,155,0.9)]"
            src={calendarIcon}
            alt="Calendar"
          />
        </div>
      </Modal>
    </>
  )
}
