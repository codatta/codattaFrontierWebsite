import submissionApi, { TSubmissionDetail } from '@/api-v1/submission.api'
import RewardHelp from '@/assets/images/reward-help.png'
import StageHelp from '@/assets/images/stage-help.png'
import { showDetailModal, submissionStore } from '@/stores/submission.store'
import { InfoCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Anchor, Image, Modal, Spin, message, type AnchorProps } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { useSnapshot } from 'valtio'
import SubmissionBasicInfo from './submission-basic-info'
import SubmissionProgress from './submission-progress'
import { TEvidence } from '@/api-v1/validation.api'
import { AnchorContainer } from 'antd/es/anchor/Anchor'

type SubmissionDetailModalProps = {
  onClose?: () => void
  title?: string
}

export default function SubmissionDetailModal(props: SubmissionDetailModalProps) {
  const { onClose = () => showDetailModal(false) } = props
  const { selectedItem, isShowDetailModel } = useSnapshot(submissionStore)
  const [errMsg, setErrMsg] = useState<string>('')
  //

  const submission_id = selectedItem?.submission_id
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [submission, setSubmission] = useState<TSubmissionDetail>()
  const [evidence, setEvidence] = useState<TEvidence[] | TEvidence>([])

  const params = useRef({
    submission_id: ''
  })

  async function handleAppend(value: TEvidence) {
    const evidenceList = evidence ? (Array.isArray(evidence) ? evidence : [evidence]) : []
    await submissionApi.appendEvidence(params.current.submission_id, [
      ...evidenceList,
      {
        ...value,
        date: new Date().getTime()
      }
    ])
    message.success('Evidence added successfully')
    getSubmissionDetail(params.current.submission_id)
  }

  useEffect(() => {
    if (submission_id) {
      params.current.submission_id = submission_id
      getSubmissionDetail(submission_id!)
    }
  }, [submission_id])

  async function getSubmissionDetail(id: string) {
    setLoading(true)
    try {
      const res = await submissionApi.getSubmissionDetail(id)
      const evidence = JSON.parse(res.data.basic_info.evidence) as TEvidence | TEvidence[]
      setEvidence(evidence)
      setSubmission(res.data)
      params.current.submission_id = id
    } catch (err) {
      message.error(err)
    }
    setLoading(false)
  }

  function RewardInfo() {
    if (submission)
      return (
        <div className="mb-6">
          <h4 className="mb-4 flex items-center justify-between text-sm font-medium" id="details">
            <div>Reward: {submission.reward.total_point}</div>
            <a
              className="text-xs font-normal text-primary"
              onClick={() => {
                document.querySelector('#reward')?.scrollIntoView()
              }}
            >
              <QuestionCircleOutlined size={12} className="mr-1" />
              How do we calculate reward?
            </a>
          </h4>
          <div className="rounded-2xl bg-gray-200 p-6">
            <SubmissionProgress
              reward={submission?.reward}
              tooltipTitle="Estimated completion time"
              onPopErrMsg={setErrMsg}
            />
          </div>
        </div>
      )
  }

  return (
    <Modal
      width={960}
      open={isShowDetailModel}
      destroyOnClose
      title={step === 'form' ? props.title : null}
      onCancel={() => onClose && onClose()}
      closable={step === 'loading' ? false : true}
      afterClose={() => setStep('form')}
      footer={null}
      styles={{
        content: { padding: 0 },
        header: { padding: '16px 24px', margin: 0, borderBottom: '1px solid #20003618' }
      }}
    >
      {submission?.status === 'S1_FAILED' && errMsg && (
        <div className="py-2 text-center font-normal text-[#C30000]">
          <InfoCircleOutlined size={14} className="mr-2" />
          {errMsg}
        </div>
      )}
      <Spin spinning={loading}>
        <HelpWrapper>
          <>
            <RewardInfo></RewardInfo>
            <div className="mb-4">
              <SubmissionBasicInfo
                address={submission?.basic_info?.address || ''}
                category={submission?.basic_info?.category || ''}
                entity={submission?.basic_info?.entity || ''}
                network={submission?.basic_info?.network || ''}
                evidence={evidence}
                onAppend={submission?.status === 'S1_PASSED' ? handleAppend : undefined}
              />
            </div>
          </>
        </HelpWrapper>
      </Spin>
      <div className="flex justify-end gap-2 p-5"></div>
    </Modal>
  )
}
function HelpWrapper(props: { children?: React.ReactElement }) {
  const scrollable = useRef<HTMLDivElement>(null)
  return (
    <div className="flex p-6">
      <div className="box-border max-h-[500px] flex-1 overflow-auto" ref={scrollable}>
        {props.children}
        <h4 className="mb-4 text-sm font-medium" id="stages">
          Stages
        </h4>
        <Image src={StageHelp} preview={false} />
        <h4 className="my-5 text-sm font-medium" id="reward">
          Reward
        </h4>
        <Image src={RewardHelp} preview={false} />
        <div className="h-[150px]"></div>
      </div>
      <HelpAnchor className="w-[100px] flex-none" getContainer={() => scrollable.current as AnchorContainer} />
    </div>
  )
}

function HelpAnchor(props: AnchorProps) {
  return (
    <Anchor
      onClick={(e, { href }) => {
        e.preventDefault()
        document.querySelector<HTMLElement>(href)?.scrollIntoView()
      }}
      items={[
        {
          key: '1',
          href: '#details',
          title: 'Details'
        },
        {
          key: '2',
          title: 'Help',
          href: '#stages',
          children: [
            {
              key: '3',
              title: 'Stages',
              href: '#stages'
            },
            {
              key: '4',
              title: 'Reward',
              href: '#reward'
            }
          ]
        }
      ]}
      {...props}
    />
  )
}
