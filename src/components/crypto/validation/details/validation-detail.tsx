import { useEffect, useRef, useState } from 'react'
import { ConfigProvider, Spin, Tabs, Timeline, Tooltip } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import { VALIDATION_TIPS } from '@/config/validation-tips'

import 'highlight.js/styles/atom-one-light.css'
import { shortenAddress } from '@/utils/wallet-address'
import Copy from '@/components/common/copy'
import EvidenceDetail from '@/components/crypto/evidence/evidence-detail'
import { TEvidence, TValidationDetail } from '@/api-v1/validation.api'
import { TSubmissionDetail } from '@/api-v1/submission.api'

hljs.registerLanguage('json', json)

export interface ValidationDetailProps {
  validation: TValidationDetail
}

export default function ValidationDetail(props: ValidationDetailProps) {
  const { validation } = props
  const [tab, setTab] = useState('evidence')

  if (!validation) return <Spin className="w-full" />

  return (
    <div className="flex max-h-full flex-col gap-3">
      <h2 className="font-bold">
        New Submission
        <span className="pl-2 text-sm font-normal">
          {validation?.basic_info?.submit_time && dayjs(validation?.basic_info?.submit_time).format('YYYY/MM/DD')}
        </span>
      </h2>
      <SubmissionInfo basicInfo={validation.basic_info} explorer={validation.explorer_link} />

      <ConfigProvider
        theme={{
          components: {
            Tabs: {
              horizontalItemPadding: '4px 0'
            }
          }
        }}
      >
        <Tabs
          items={[
            {
              label: 'Evidence',
              key: 'evidence'
            },
            ...(validation.existing_data?.length
              ? [
                  {
                    label: <Tooltip title={VALIDATION_TIPS.existingData}>Existing Data</Tooltip>,
                    key: 'data'
                  }
                ]
              : []),
            ...(validation.submitter_info ? [{ label: 'Submitter Info', key: 'submitter' }] : [])
          ]}
          onChange={setTab}
          className="mb-4 [&_.ant-tabs-nav:before]:hidden [&_.ant-tabs-tab-btn]:font-semibold"
        />
        {tab === 'evidence' && (
          <div className="-mt-4 flex-1 overflow-y-auto rounded border border-white/10 p-4 pb-0">
            <EvidenceTimeline
              evidence={JSON.parse(validation?.basic_info?.evidence)}
              explorer={validation?.explorer_link}
            />
          </div>
        )}
        {tab === 'data' && (
          <div className="-mt-4 flex-1 overflow-y-auto rounded bg-[#2B005506] px-2">
            <CodeSnippet code={validation.existing_data.map((data) => JSON.stringify(data, null, 4)).join('\n\n')} />
          </div>
        )}
        {tab === 'submitter' && (
          <div className="-mt-4 overflow-y-auto rounded border border-white/10 p-4">
            <SubmitterInfo info={validation.submitter_info} />
          </div>
        )}
      </ConfigProvider>
    </div>
  )
}

function CodeSnippet(props: { code: string }) {
  const codeRef = useRef<HTMLElement | null>(null)
  useEffect(() => {
    if (!codeRef.current) return
    hljs.highlightElement(codeRef.current)
  }, [])
  return (
    <pre>
      {/* <code className="json" ref={codeRef}> */}
      <code ref={codeRef}>{props.code}</code>
    </pre>
  )
}

const SOURCE_TYPE: { [key: string]: string } = {
  SUBMISSION: 'Submission',
  HUNTING_ENTITY: 'Bounty-Submit Entity',
  HUNTING_ADDRESS: 'Bounty-Submit Address'
}

const SubmissionInfo = ({
  basicInfo,
  explorer
}: {
  explorer?: TValidationDetail['explorer_link']
  basicInfo: TSubmissionDetail['basic_info']
}) => (
  <div className="flex flex-col gap-2 rounded bg-white/5 px-6 py-3">
    <h2 className="flex items-start justify-between gap-2 text-base font-bold text-primary">
      <div>
        <a href={explorer?.address_link} target="_blank" className="break-all">
          <Tooltip title={basicInfo.address}>{shortenAddress(basicInfo.address, 30)}</Tooltip>
          <Copy
            size={14}
            content={basicInfo.address}
            className="ml-2 inline text-white"
            onClick={(e) => {
              e.preventDefault()
            }}
          />
        </a>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-gray-200 px-2 py-1 text-xs font-bold text-white/65">
        {basicInfo.network}
      </div>
    </h2>
    <div className="flex gap-2">
      <Tooltip title={VALIDATION_TIPS.catetory} className="cursor-pointer">
        Category:
      </Tooltip>
      <span className="">{basicInfo.category}</span>
    </div>
    <div className="flex gap-2">
      <Tooltip title={VALIDATION_TIPS.entity} className="cursor-pointer">
        Entity:
      </Tooltip>
      <span className="">{basicInfo.entity}</span>
    </div>
    <div className="flex gap-2">
      <div className="w-[100px] text-gray-500">Data Source:</div>
      <span className="">{SOURCE_TYPE[basicInfo.source] || 'All'}</span>
    </div>
  </div>
)

function EvidenceTimeline(props: { evidence: TEvidence | TEvidence[]; explorer?: TValidationDetail['explorer_link'] }) {
  const evidences = (Array.isArray(props.evidence) ? props.evidence : [props.evidence]).filter(Boolean)

  return (
    <Timeline
      items={evidences.map((evidence) => ({
        dot: <ClockCircleOutlined size={12} />,
        children: (
          <div className="flex flex-col gap-3">
            <h3 className="font-medium leading-relaxed empty:hidden">
              {evidence.date && dayjs(evidence.date).format('YYYY/MM/DD')}
            </h3>
            <EvidenceDetail evidence={evidence} explorer={props.explorer} />
          </div>
        )
      }))}
    />
  )
}

function SubmitterInfo(props: { info: TValidationDetail['submitter_info'] }) {
  const {
    hunting_count,
    hunting_s2_pass_count,
    hunting_s2_pass_proportion,
    hunting_s2_review_count,
    points,
    reputation,
    s2_pass_count,
    s2_pass_proportion,
    s2_review_count,
    s2_review_proportion,
    submission_count
  } = props.info

  return (
    <div className="flex flex-col gap-3 text-sm leading-4">
      <div>
        <span className="inline-block w-[184px] text-white/45">Reputation:</span>
        <span className="">{reputation}</span>
      </div>
      <div>
        <span className="inline-block w-[184px] text-white/45">Reward:</span>
        <span className="">{points}</span>
      </div>

      <div className="my-1 border-b text-white/80"></div>

      <div className="mb-1">Submission Data</div>
      <div>
        <span className="inline-block w-[184px] text-white/45">Number of passed s2-2:</span>
        <span className="">{s2_pass_count}</span>
      </div>
      <div>
        <span className="inline-block w-[184px] text-gray-400">Number of entered s2-2:</span>
        <span className="">{s2_review_count}</span>
      </div>
      <div>
        <span className="inline-block w-[184px] text-gray-400">Number of submissions:</span>
        <span className="">{submission_count}</span>
      </div>
      <div className="flex items-center gap-2 rounded-sm bg-gray-100 p-2">
        <span className="text-gray-400">Pass rate of s2-2:</span>
        <span className="mr-4 rounded-[4px] bg-primary/30 px-[8px] py-[2px] text-primary">{s2_pass_proportion}%</span>
        <span className="text-gray-400">Enter rate of s2-2:</span>
        <span className="rounded-[4px] bg-primary px-[8px] py-[2px] text-primary/30">{s2_review_proportion}%</span>
      </div>

      <div className="my-1 border-b border-gray-200"></div>

      <div className="mb-1">Bounty Data</div>
      <div>
        <span className="inline-block w-[184px] text-gray-400">Number of passed s2-2:</span>
        <span className="">{hunting_s2_pass_count}</span>
      </div>
      <div>
        <span className="inline-block w-[184px] text-gray-400">Number of entered s2-2:</span>
        <span className="">{hunting_s2_review_count}</span>
      </div>
      <div>
        <span className="inline-block w-[184px] text-gray-400">Number of submissions:</span>
        <span className="">{hunting_count}</span>
      </div>

      <div className="flex items-center gap-2 rounded-[4px] bg-gray-100 p-2">
        <span className="text-gray-400">Pass rate of s2-2:</span>
        <span className="mr-4 rounded-[4px] bg-primary/30 px-[8px] py-[2px] text-primary">
          {hunting_s2_pass_proportion}%
        </span>
      </div>
    </div>
  )
}
