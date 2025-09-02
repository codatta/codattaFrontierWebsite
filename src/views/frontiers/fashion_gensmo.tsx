import { Button, Spin } from 'antd'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

import { RulesModal } from '@/components/frontier/fashion-gensmo/rules-model'
import { DownloadTask } from '@/components/frontier/fashion-gensmo/download-task'
import { EmailTask } from '@/components/frontier/fashion-gensmo/email-task'

const FashionGensmo: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [pageLoading, setPageLoading] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)

  const onBack = () => {
    window.history.back()
  }

  return (
    <Spin spinning={pageLoading} className="min-h-screen">
      <div className="min-h-screen py-3 text-white md:py-8">
        <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
          <h1 className="mx-auto flex max-w-[1272px] items-center justify-between px-6 text-center text-base font-bold">
            <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
              <ArrowLeft size={18} /> Back
            </div>
            AI-Powered Fashion App Trial
            <Button
              className="h-[42px] rounded-full border-[#FFFFFF] px-6 text-sm text-[white]"
              onClick={() => setShowRulesModal(true)}
            >
              Task Rules
            </Button>
          </h1>
        </div>
        <div className="mx-auto max-w-[1272px] space-y-6 px-6 py-12">
          <h3 className="text-xl font-bold">Day1</h3>
          <DownloadTask className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6" />
          <EmailTask className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6" />
        </div>
      </div>
      <RulesModal show={showRulesModal} onClose={() => setShowRulesModal(false)} />
    </Spin>
  )
}

export default FashionGensmo
