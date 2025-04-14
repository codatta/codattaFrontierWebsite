import React, { useState } from 'react'
import { X } from 'lucide-react'

interface InformedConsentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: () => void
}

const InformedConsentForm: React.FC<InformedConsentFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [ageConsent, setAgeConsent] = useState(false)
  const [termsConsent, setTermsConsent] = useState(false)
  const [residenceConsent, setResidenceConsent] = useState(false)

  const handleSubmit = () => {
    if (ageConsent && termsConsent && residenceConsent) {
      onSubmit()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed left-0 top-0 z-50 flex size-full items-center justify-center bg-[#1C1C26B8]">
      <div className="relative w-[800px] rounded-2xl bg-[#252532] text-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#FFFFFF1F] px-6 pb-3 pt-6">
          <h2 className="text-xl font-semibold leading-[30px]">Informed Consent Form</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white" aria-label="Close">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="h-[366px] overflow-y-auto p-6">
          {/* Purpose */}
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Purpose of this Study</h3>
            <p className="text-gray-700">
              The purpose of the study is to investigate pricing methods for data annotation tasks.
            </p>
          </div>

          {/* Summary */}
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Summary</h3>
            <p className="text-gray-700">
              We are conducting a study to investigate pricing strategies for data annotation tasks. Participants will
              be asked to complete video evaluation tasks on Codatta.io, a data annotation platform. Participants will
              receive Codatta reward points for each annotation they provide, which translates to a dollar amount (in
              USD) that the participants will be paid.
            </p>
            <p className="text-gray-700">
              Participants will be asked to compare and evaluate video clips based on a text query (e.g., "How do I cut
              a mango?"). In order to complete the task, the participants should be familiar with basic website usage
              (e.g., playing a video, entering text).
            </p>
          </div>

          {/* Procedures */}
          <div className="mb-2">
            <h3 className="mb-2 text-sm font-semibold leading-[22px] text-[#FFFFFF]">Procedures</h3>
            <p className="text-gray-700">
              After providing consent, participants will be redirected to Co-datta.io to complete the task.
            </p>
            <p className="text-gray-700">
              To perform the video evaluation task, participants will be shown a text query (e.g., "How do you slice a
              mango?") and two videos that attempt to address the query. Participants will be asked which video is
              better at addressing the query and why. Participants may be asked to complete multiple such evaluations.
            </p>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="flex items-end justify-between border-t border-[#FFFFFF1F] p-6">
          <div className="space-y-3">
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={ageConsent}
                onChange={(e) => setAgeConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-700">Age ≥ 18</span>
            </label>

            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={termsConsent}
                onChange={(e) => setTermsConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-700">I have read and agree to the terms of this consent form.</span>
            </label>

            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={residenceConsent}
                onChange={(e) => setResidenceConsent(e.target.checked)}
                className="mt-1"
              />
              <span className="text-gray-700">I certify I am currently residing in the U.S.</span>
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button onClick={onClose} className="h-[42px] w-[120px] text-center text-[#FFFFFF]">
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={!ageConsent || !termsConsent || !residenceConsent}
              className={`h-[42px] w-[120px] rounded-[36px] bg-primary text-center text-[#FFFFFF] ${
                ageConsent && termsConsent && residenceConsent
                  ? 'opacity-100 hover:bg-[#8A5AEE]'
                  : 'cursor-not-allowed opacity-50'
              } transition-colors`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InformedConsentForm
