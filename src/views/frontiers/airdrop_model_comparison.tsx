import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useParams } from 'react-router-dom'

import AuthChecker from '@/components/app/auth-checker'
import Guideline from '@/components/frontier/airdrop/model-comparison/guideline'
import MyForm from '@/components/frontier/airdrop/model-comparison/form'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'

import frontiterApi from '@/apis/frontiter.api'

export default function AirdropModelComparison({ templateId }: { templateId: string }) {
  const { taskId } = useParams()
  const [pageLoading, setPageLoading] = useState(false)
  const [modalShow, setModalShow] = useState(false)
  const [rewardPoints, setRewardPoints] = useState(0)

  const onBack = () => {
    window.history.back()
  }

  async function getTaskDetail(taskId: string, templateId: string) {
    setPageLoading(true)
    try {
      const res = await frontiterApi.getTaskDetail(taskId)
      if (res.data.data_display.template_id !== templateId) {
        throw new Error('Template not match!')
      }
      const totalRewards = res.data.reward_info
        .filter((item) => {
          return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
        })
        .reduce((acc, cur) => {
          return acc + cur.reward_value
        }, 0)

      console.log(totalRewards, 'totalRewards')
      setRewardPoints(totalRewards)
    } catch (err) {
      message.error(err.message)
    }
    setPageLoading(false)
  }

  useEffect(() => {
    if (!taskId) return
    getTaskDetail(taskId!, templateId)
  }, [taskId, templateId])

  const onSubmit = async (data: unknown) => {
    try {
      setPageLoading(true)
      await frontiterApi.submitTask(taskId!, {
        taskId: taskId!,
        templateId: templateId,
        data
      })
      setModalShow(true)
    } catch (error) {
      message.error((error as Error).message || 'Failed to submit!')
    } finally {
      setPageLoading(false)
    }
  }

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="min-h-screen py-3 md:py-8">
          <div className="border-[#FFFFFF1F] pb-3 md:border-b md:pb-8">
            <h1 className="mx-auto flex max-w-[1320px] items-center justify-between px-6 text-center text-base font-bold">
              <div className="flex cursor-pointer items-center gap-2 text-sm font-normal text-[white]" onClick={onBack}>
                <ArrowLeft size={18} /> Back
              </div>
              Kitchen Appliance Knob Collection
              <span></span>
            </h1>
          </div>
          <div className="mt-12 bg-[#FFFFFF0A]">
            <div className="mx-auto max-w-[1320px] px-6">
              <Guideline />
            </div>
          </div>
          <MyForm onSubmit={onSubmit} />
        </div>
        <SubmitSuccessModal points={rewardPoints} open={modalShow} onClose={() => window.history.back()} />
      </Spin>
    </AuthChecker>
  )
}

// http://localhost:5175/frontier/project/AIRDROP_MODEL_COMPARISON/8608441980300101771
// http://localhost:5175/frontier/project/CRYPTO_TPL_DEPOSIT/8088437676800107826/task-6-crypto1time
