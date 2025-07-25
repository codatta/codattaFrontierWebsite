import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Spin, message, Result as AntResult, Button, Modal } from 'antd'
import { ArrowLeft } from 'lucide-react'

import AuthChecker from '@/components/app/auth-checker'
import Result from '@/components/frontier/crypto/result'
import WithdrawForm from '@/components/frontier/crypto/withdraw-form'
import DepositForm from '@/components/frontier/crypto/deposit-form'
import SubmitSuccessModal from '@/components/robotics/submit-success-modal'
// import PageError from '@/components/robotics/page-error'
import { DepositFormData, ResultType, WithdrawFormData } from '@/components/frontier/crypto/types'

import { useIsMobile } from '@/hooks/use-is-mobile'
import frontiterApi from '@/apis/frontiter.api'

async function getLastSubmission(frontierId: string) {
  const res = await frontiterApi.getSubmissionList({ page_num: 1, page_size: 1, frontier_id: frontierId })
  const lastSubmission = res.data[0]
  return lastSubmission
}

export default function CryptoTpl000001({ templateId }: { templateId: string }) {
  const { taskId, questId = '' } = useParams()
  const isMobile = useIsMobile()
  const isWithdraw = templateId.toLocaleUpperCase().includes('WITHDRAW')
  const isBnb = questId.toLocaleUpperCase().includes('TASK')

  const [rewardPoints, setRewardPoints] = useState(0)
  const [pageLoading, setPageLoading] = useState(false)
  const [resultType, setResultType] = useState<'ADOPT' | 'PENDING' | 'REJECT' | null>(null)

  const handleResultStatus = (status: string = '') => {
    status = status.toLocaleUpperCase()
    if (['PENDING', 'SUBMITTED'].includes(status)) {
      setResultType('PENDING')
    } else if (status === 'REFUSED') {
      setResultType('REJECT')
    } else if (status === 'ADOPT') {
      setResultType('ADOPT')
    }
  }

  useEffect(() => {
    console.log('questId', questId)
  }, [questId])

  const onSubmit = async (formData: WithdrawFormData | DepositFormData): Promise<boolean> => {
    try {
      const res = await frontiterApi.submitTask(taskId!, {
        templateId: templateId,
        taskId: taskId,
        data: Object.assign(
          { type: isWithdraw ? 'withdraw' : 'deposit', source: isBnb ? 'binance' : 'codatta' },
          formData
        )
      })

      const resultData = res.data as unknown as {
        status: ResultType
      }

      message.success('Submitted successfully!').then(() => {
        handleResultStatus(resultData?.status)
      })
    } catch (error) {
      message.error(error.message ? error.message : 'Failed to submit!')
      return false
    }
    return true
  }

  const onSubmitAgain = () => {
    setResultType(null)
  }

  const checkTaskStatus = useCallback(async () => {
    if (!taskId || !templateId) {
      message.error('Task ID or template ID is required!')
      return
    }

    setPageLoading(true)

    try {
      const taskDetail = await frontiterApi.getTaskDetail(taskId!)
      if (taskDetail.data.data_display.template_id !== templateId) {
        message.error('Template not match!')
        return
      }

      if (isBnb) {
        const lastSubmission = await getLastSubmission(taskDetail.data.frontier_id)
        handleResultStatus(lastSubmission?.status)
      } else {
        const totalRewards = taskDetail.data.reward_info
          .filter((item) => {
            return item.reward_mode === 'REGULAR' && item.reward_type === 'POINTS'
          })
          .reduce((acc, cur) => {
            return acc + cur.reward_value
          }, 0)

        setRewardPoints(totalRewards)
      }
    } catch (error) {
      Modal.error({
        title: 'Error',
        content: error.message ? error.message : 'Failed to get task detail!',
        okText: 'Try Again',
        className: '[&_.ant-btn]:!bg-[#875DFF]',
        onOk: () => {
          checkTaskStatus()
        }
      })
    } finally {
      setPageLoading(false)
    }
  }, [taskId, templateId, isBnb])

  useEffect(() => {
    // checkTaskStatus()
  }, [checkTaskStatus])

  return (
    <AuthChecker>
      <Spin spinning={pageLoading} className="min-h-screen">
        <div className="mx-auto min-h-screen max-w-[1272px] px-6 py-3 md:py-8">
          <h1 className="flex items-center justify-between text-center text-base font-bold">
            {!isMobile ? (
              <div className="flex items-center gap-2 text-sm font-normal text-[white]">
                <ArrowLeft size={18} /> Back
              </div>
            ) : (
              <span></span>
            )}
            Submit {isWithdraw ? 'Withdraw' : 'Deposit'}
            {isBnb ? ' Data' : ''}
            <span></span>
          </h1>
          {resultType ? (
            isBnb ? (
              <Result type={resultType} onSubmitAgain={onSubmitAgain} />
            ) : (
              <SubmitSuccessModal points={rewardPoints} open={true} onClose={() => window.history.back()} />
            )
          ) : isWithdraw ? (
            <WithdrawForm isMobile={isMobile} resultType={resultType} onSubmit={onSubmit} />
          ) : (
            <DepositForm isMobile={isMobile} resultType={resultType} onSubmit={onSubmit} />
          )}
        </div>
      </Spin>
    </AuthChecker>
  )
}
