import { Button, Input, Rate, Spin } from 'antd'
import { ArrowLeft, Info } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'

import { RulesModal } from '@/components/frontier/fashion-gensmo/rules-model'
import { DownloadTask } from '@/components/frontier/fashion-gensmo/download-task'
import { EmailTask } from '@/components/frontier/fashion-gensmo/email-task'

import task3Img from '@/assets/frontier/fashion-gensmo/task-3.png'
import task4Img from '@/assets/frontier/fashion-gensmo/task-4.png'
import task5Img from '@/assets/frontier/fashion-gensmo/task-5.png'
import runes from 'runes2'
import { cn } from '@udecode/cn'

const FashionGensmo: React.FC<{ templateId: string }> = ({ templateId }) => {
  const [pageLoading, setPageLoading] = useState(false)
  const [showRulesModal, setShowRulesModal] = useState(false)
  const { taskId } = useParams()
  const [form, setForm] = useState({
    search_agent_rating: 0,
    try_on_rating: 0,
    post_rating: 0,
    feedback: ''
  })

  const onBack = () => {
    window.history.back()
  }

  const onRateChange = (key: string, value: number) => {
    setForm({
      ...form,
      [key]: value
    })
  }

  const onSubmit = () => {
    console.log('form', form)
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
          <EmailTask className="overflow-hidden rounded-2xl border-[#00000029] bg-[#252532] p-6" taskId={taskId!} />
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
                <Rate
                  onChange={(val) => onRateChange('search_agent_rating', val)}
                  value={form.search_agent_rating}
                  className="mt-2 text-xl text-[#FCC800]"
                />
              </div>
              <div>
                <div className="font-semibold">Try-on Rating</div>
                <Rate
                  onChange={(val) => onRateChange('try_on_rating', val)}
                  value={form.try_on_rating}
                  className="mt-2 text-xl"
                />
              </div>
              <div>
                <div className="font-semibold">Post Rating</div>
                <Rate
                  onChange={(val) => onRateChange('post_rating', val)}
                  value={form.post_rating}
                  className="mt-2 text-xl"
                />
              </div>
            </div>
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
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
              />
            </div>
          </section>
          <Button
            type="primary"
            className={cn('mx-auto mt-12 block h-[48px] w-[240px] rounded-full', form.feedback ? '' : 'opacity-30')}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
      <RulesModal show={showRulesModal} onClose={() => setShowRulesModal(false)} />
    </Spin>
  )
}

export default FashionGensmo
