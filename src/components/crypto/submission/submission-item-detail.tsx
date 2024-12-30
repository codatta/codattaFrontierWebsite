import submissionApi, { TSubmissionBasicInfo, TSubmissionDetail } from '@/api-v1/submission.api'
import { Spin, Image, Tooltip } from 'antd'
import { useEffect, useState } from 'react'
import SubmissionProgress from '@/components/crypto/submission/submission-progress'
import Copy from '@/components/common/copy'
import { VALIDATION_TIPS } from '@/configs/config'
import { Atom, FileText, ImageIcon, Link } from 'lucide-react'
import NetworkIcon from '@/components/common/network-icon'
import dayjs from 'dayjs'
import { TEvidence, TValidationDetail } from '@/api-v1/validation.api'

function SubmissionBasicInfo(props: { basicInfo: TSubmissionBasicInfo }) {
  const { basicInfo } = props
  return (
    <div className="mb-4 flex flex-col gap-4 leading-[24px]">
      <div className="flex items-center gap-6">
        <div className="w-[72px] text-white/20">Network</div>
        <div className="flex items-center gap-2">
          <NetworkIcon size={20} type={basicInfo?.network}></NetworkIcon>
          <span>{basicInfo?.network}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[72px] text-white/20">Network</div>

        <div className="flex items-center gap-2">
          <span>{basicInfo?.address}</span>
          <Copy content={basicInfo?.address}></Copy>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[72px] text-white/20">Network</div>

        <div className="flex items-center gap-2">
          <span>{basicInfo?.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="w-[72px] text-white/20">Network</div>

        <div className="flex items-center gap-2">
          <span>{basicInfo?.entity || '--'}</span>
        </div>
      </div>
    </div>
  )
}

export default function SubmissionItemDetail(props: { submissionId: string }) {
  const { submissionId } = props
  const [submission, setSubmission] = useState<TSubmissionDetail>()
  const [loading, setLoading] = useState(false)

  async function loadData(submissionId: string) {
    setLoading(true)
    const res = await submissionApi.getSubmissionDetail(submissionId)
    setSubmission(res.data)
    setLoading(false)
  }

  useEffect(() => {
    if (!submissionId) return
    loadData(submissionId)
  }, [submissionId])

  const evidenceObject = JSON.parse(submission?.basic_info.evidence ?? 'null')
  const evidences = (Array.isArray(evidenceObject) ? evidenceObject : [evidenceObject]).filter(Boolean)

  return (
    <Spin spinning={loading}>
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-2 font-medium">
            Reward:
            {submission?.reward.total_point ? (
              <span className="ml-1">
                ({submission?.reward.total_point}/Estimate {submission?.reward.estimate_point} points)
              </span>
            ) : null}
          </h3>
          <div className="rounded-xl bg-gray-200 px-4 pb-3 pt-4">
            {submission?.reward && (
              <SubmissionProgress reward={submission?.reward} tooltipTitle="Estimated completion time" />
            )}
          </div>
        </div>
        <div>
          <h3 className="mb-2 font-medium">Evidence</h3>
          <div className="rounded-xl bg-gray-200 p-4 text-white">
            {submission?.basic_info && <SubmissionBasicInfo basicInfo={submission?.basic_info} />}
            {evidences.map((item: TEvidence) => {
              return (
                <div>
                  <div className="mb-2 flex items-center gap-6">
                    <div className="w-[72px] text-gray-700">Evidence</div>
                    <div className="flex items-center gap-2">
                      <span>{dayjs(item.date || item.data).format('YYYY/MM/DD')}</span>
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 p-2">
                    <EvidenceItemDetail evidence={item} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Spin>
  )
}

function EvidenceItemDetail(props: { evidence: TEvidence; explorer?: TValidationDetail['explorer_link'] }) {
  const {
    evidence: { link, hash, text, files: _files, translation },
    explorer
  } = props

  const files = _files?.filter((v) => v && v.path) ?? []

  return (
    <div className="flex w-full gap-6 text-white">
      <div className="flex w-3/5 min-w-0 flex-col gap-4">
        {hash && (
          <div>
            <div className="mb-2 flex items-center gap-1 text-gray-700">
              <Atom size={16}></Atom>
              <h3 className="text-sm font-semibold">TxHash</h3>
            </div>
            <div className="flex items-center gap-1 break-all">
              <a
                className="truncate"
                href={explorer && explorer.base_link + (explorer.hash_match ?? '').replace(/%s/, hash)}
                target="_blank"
              >
                {hash}
              </a>
              <Copy className="shrink-0" content={hash} />
            </div>
          </div>
        )}

        {text?.trim() && (
          <div>
            <div className="flex items-center gap-1 text-gray-700">
              <FileText size={16}></FileText>
              <h3 className="text-sm font-semibold">Description</h3>
            </div>
            <div className="break-all">
              {translation && translation.trim() !== text?.trim() && (
                <>
                  <div>AI Translator:</div>
                  <pre className="text-wrap">{translation}</pre>
                  <div className="mt-4">Original:</div>
                </>
              )}
              <pre className="text-wrap">{text}</pre>
            </div>
          </div>
        )}

        {link && (
          <div>
            <div className="flex items-center gap-1 text-gray-700">
              <Link size={16}></Link>
              <h3 className="text-sm font-semibold">
                <Tooltip title={VALIDATION_TIPS.link} className="cursor-pointer">
                  Link
                </Tooltip>
              </h3>
            </div>

            <div className="break-all">
              <Tooltip title={link}>
                <a href={link} target="_blank">
                  {link}
                </a>
              </Tooltip>
            </div>
          </div>
        )}
      </div>
      <div className="w-2/5 shrink-0">
        <div className="mb-2">
          <div className="flex items-center gap-1 text-gray-700">
            <ImageIcon size={16}></ImageIcon>
            <h3 className="text-sm font-semibold">Image</h3>
          </div>
        </div>
        <Image.PreviewGroup items={files.map(({ path }) => path)}>
          <div className="grid grid-cols-2 gap-2">
            {files.map(({ path }, i) => (
              <div className="flex items-center justify-center overflow-hidden rounded-lg border border-gray-300">
                <Image style={{ objectFit: 'contain', aspectRatio: '16/9' }} src={path} className="" key={i}></Image>
              </div>
            ))}
          </div>
        </Image.PreviewGroup>
      </div>
    </div>
  )
}
