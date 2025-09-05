import { Button, Form, Input, Rate, Spin, message, Modal } from 'antd'
import { ArrowLeft, Info, Loader2 } from 'lucide-react'
import { useState, useCallback, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import runes from 'runes2'
import { cn } from '@udecode/cn'

import { RulesModal } from '@/components/frontier/fashion-gensmo/rules-model'
import ResultModel from '@/components/frontier/fashion-gensmo/result-model'
import { DownloadTask } from '@/components/frontier/fashion-gensmo/download-task'
import { EmailTask } from '@/components/frontier/fashion-gensmo/email-task'

import task3Img from '@/assets/frontier/fashion-gensmo/task-3.png'
import task4Img from '@/assets/frontier/fashion-gensmo/task-4.png'
import task5Img from '@/assets/frontier/fashion-gensmo/task-5.png'

import frontiterApi from '@/apis/frontiter.api'
import { ResultType } from '@/components/frontier/fashion-gensmo/types'

const FashionGensmo: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [form] = Form.useForm()
  const [pageLoading, setPageLoading] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const { taskId } = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verifiedEmail, setVerifiedEmail] = useState('')
  const [result, setResult] = useState<ResultType | null>(null)

  const onBack = () => {
    window.history.back()
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (!taskId) throw new Error('Task ID is required')
      if (!verifiedEmail) throw new Error('Please verify your email first')

      const values = await form.validateFields()
      const submitData = {
        taskId,
        templateId,
        data: values
      }
      await frontiterApi.submitTask(taskId, submitData)
      setResult('ADOPT')
    } catch (error) {
      console.error(error)
      message.error(error.message ? error.message : 'Please check all required fields')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEmailVerified = (email: string) => {
    console.log('email', email)
    setVerifiedEmail(email)
  }

  const handleSubmitAgain = () => {
    window.location.reload()
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

      // const submission = await frontiterApi.getLastSubmission(taskDetail.data.frontier_id, taskId!)
      // setResult((submission?.status as ResultType) ?? null)
      const submission = await frontiterApi.getLastSubmission(taskDetail.data.frontier_id, taskId!)
      if (submission) {
        setResult('ADOPT')
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
  }, [taskId, templateId])

  useEffect(() => {
    checkTaskStatus()
  }, [checkTaskStatus])

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
        <Form form={form} className="mx-auto max-w-[1272px] space-y-6 px-6 py-12">
          <h3 className="text-xl font-bold">Day1</h3>
          <DownloadTask className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6" />
          <EmailTask
            className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6"
            taskId={taskId!}
            onEmailVerified={handleEmailVerified}
          />
          <section className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#875DFF33] px-3 py-[2px] text-sm font-semibold text-[#875DFF]">
                Task3
              </span>
              <span className="text-base font-bold">Create your avator *</span>
            </div>
            <img src={task3Img} alt="" className="mt-3 h-auto w-full" />
          </section>
          <h3 className="!mt-12 flex items-center justify-between text-xl font-bold">
            Day2{' '}
            <div className="flex flex-1 items-center justify-end gap-1 text-sm font-normal text-[#FFA800]">
              <Info className="mr-1" size={14} />
              Complete Day 2 tasks after 00:00 UTC to qualify for the reward.
            </div>
          </h3>
          <section className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#875DFF33] px-3 py-[2px] text-sm font-semibold text-[#875DFF]">
                Task4
              </span>
              <span className="text-base font-bold">Perform a search / Use an agent *</span>
            </div>
            <img src={task4Img} alt="" className="mt-3 h-auto w-full" />
          </section>
          <section className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#875DFF33] px-3 py-[2px] text-sm font-semibold text-[#875DFF]">
                Task5
              </span>
              <span className="text-base font-bold">Perform a try-on and create a post *</span>
            </div>
            <img src={task5Img} alt="" className="mt-3 h-auto w-full" />
          </section>
          <section className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#875DFF33] px-3 py-[2px] text-sm font-semibold text-[#875DFF]">
                Task6
              </span>
              <span className="text-base font-bold">Feature Rating and Feedback *</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4">
              <div>
                <div className="font-semibold">Search/Agent Rating</div>
                <Form.Item
                  name="search_agent_rating"
                  rules={[{ required: true, message: 'Please rate the search/agent feature' }]}
                  className="!mb-0"
                >
                  <Rate className="mt-2 text-xl text-[#FCC800]" />
                </Form.Item>
              </div>
              <div>
                <div className="font-semibold">Try-on Rating</div>
                <Form.Item
                  name="try_on_rating"
                  rules={[{ required: true, message: 'Please rate the try-on feature' }]}
                  className="!mb-0"
                >
                  <Rate className="mt-2 text-xl" />
                </Form.Item>
              </div>
              <div>
                <div className="font-semibold">Post Rating</div>
                <Form.Item
                  name="post_rating"
                  rules={[{ required: true, message: 'Please rate the post feature' }]}
                  className="!mb-0"
                >
                  <Rate className="mt-2 text-xl" />
                </Form.Item>
              </div>
            </div>
            <Form.Item name="feedback" rules={[{ required: false, message: 'Please provide feedback' }]}>
              <div>
                <div className="mt-3 font-semibold">Suggestions for the above features</div>
                <Input.TextArea
                  className="mt-2 rounded-lg border-[#FFFFFF1F]"
                  placeholder="Enter your feedback"
                  rows={2}
                  count={{
                    show: false,
                    max: 255,
                    strategy: (txt) => runes(txt).length,
                    exceedFormatter: (txt, { max }) => runes(txt).slice(0, max).join('')
                  }}
                />
              </div>
            </Form.Item>
          </section>
          <Button
            type="primary"
            htmlType="submit"
            disabled={isSubmitting}
            className={cn('mx-auto mt-12 block h-[48px] w-[240px] rounded-full')}
            onClick={handleSubmit}
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Submit'}
          </Button>
        </Form>
      </div>
      <RulesModal show={showRulesModal} onClose={() => setShowRulesModal(false)} />
      {result && <ResultModel type={result} onSubmitAgain={handleSubmitAgain} onGotIt={onBack} />}
    </Spin>
  )
}

export default FashionGensmo
