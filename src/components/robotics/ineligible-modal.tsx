import React from 'react'
import { Modal } from 'antd'
import { X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ExclamationCircleFilled } from '@ant-design/icons'

interface IneligibleModalProps {
  open: boolean
  onClose: () => void
}

const IneligibleModal: React.FC<IneligibleModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate()

  const handleConfirm = () => {
    onClose()
    navigate('/app/settings/user-profile')
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      closable={false}
      width={600}
      centered
      styles={{
        content: {
          backgroundColor: '#252532',
          padding: '24px',
          borderRadius: '24px',
          border: 'none',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }
      }}
    >
      <div className="flex w-full flex-col gap-[48px]">
        <div className="flex w-full flex-col gap-[24px]">
          <div className="flex w-full items-center justify-between">
            <h2 className="m-0 text-[18px] font-bold leading-[28px] text-white">Ineligible</h2>
            <button
              onClick={onClose}
              className="flex size-[24px] cursor-pointer items-center justify-center text-white/60 transition-colors hover:text-white"
            >
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex w-full flex-col gap-[12px] rounded-[16px] bg-[#1C1C26] p-[24px]">
            <div className="flex w-full items-start gap-[12px] border-b border-[rgba(255,255,255,0.12)] pb-[16px]">
              <ExclamationCircleFilled className="mt-[2px] shrink-0 text-[24px] text-[#FFA800]" />

              <div className="flex-1 text-[16px] leading-[24px] text-white">
                <p className="mb-0">You do not meet some of the requirements for this task.</p>
                <p className="mb-0">
                  Please go to your <span className="font-bold">User Profile</span> to check and update your
                  information:
                </p>
              </div>
            </div>

            <ul className="mb-0 ml-[28px] list-disc pt-[4px] text-[16px] leading-[24px] text-[#BBBBBE]">
              <li className="mb-[8px] pl-[4px]">If the relevant fields are editable, please update and try again</li>
              <li className="mb-0 pl-[4px]">
                If they are not editable, you are not eligible for this task. Feel free to try another one
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleConfirm}
          className="ml-auto flex min-w-[120px] cursor-pointer items-center justify-center rounded-[360px] bg-[#875DFF] px-[24px] py-[10px] text-center text-[14px] font-normal leading-[22px] text-white transition-colors hover:bg-[#9D75FF]"
        >
          Confirm
        </button>
      </div>
    </Modal>
  )
}

export default IneligibleModal
