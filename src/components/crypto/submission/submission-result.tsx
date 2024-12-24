import { TSubmissionDetail, TSubmitResult } from '@/api-v1/submission.api'
import SubmissionProgress from '@/components/crypto/submission/submission-progress'

import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { cn } from '@udecode/cn'
import { Button } from 'antd'

function SubmissionSuccess(props: {
  onClose?: () => void
  onContinue: (e: Event) => void
  detail?: TSubmissionDetail
}) {
  const { onClose, detail: { reward } = {} } = props

  // const getShareContent = (name: Social) =>
  //   shareApi.getShareLink(ShareType.Submission, submission_id, name, info.code).then((link) => ({
  //     text: `Click to enter codatta and complete ${basic_info.network} ${basic_info.category?.split(',').join('-')} tasks to win rewards!`,
  //     link: link.toString()
  //   }))

  return (
    <div className={`mx-auto w-full py-0 text-center`}>
      <CheckCircleFilled className="mb-4 text-[64px] text-success" />
      <p className="mb-3 text-xl font-bold">Verification successful</p>
      <p className="m-auto mb-8 w-[400px] text-gray-500">
        Congratulations on earning <span>{reward?.total_point} points</span>. Upon completing the entire process, you
        will receive more points.
      </p>
      <div className="mb-[48px] rounded-s-xl border border-[rgba(32,0,54,0.09)] bg-gray-200 px-4 pb-4 pt-6">
        {reward && (
          <SubmissionProgress
            reward={reward}
            tooltipTitle="Progress bar shows earned points, upcoming steps, and estimated time for each step."
          ></SubmissionProgress>
        )}
      </div>
      <div className={cn('flex flex-col items-center gap-4')}>
        <div className="flex w-full justify-center gap-4">
          {/* <ShareButton
            className="mr-auto"
            request={getShareContent}
            size="large"
            type="text"
            shape="round"
            key={submission_id}
            onShare={(social) => {
              ReactGA.event('share', {
                method: social,
                content_type: 'submission'
              })
            }}
          >
            Ask friends to help verify
          </ShareButton> */}
          {/* <Button size="large" onClick={onContinue}>
            Submit Another
          </Button> */}
          <Button type="primary" shape="round" size="large" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </div>
  )
}

function SubmissionError(props: { reason: string; onClose?: () => void }) {
  const { reason, onClose } = props
  return (
    <div>
      <div className={`flex flex-col items-center py-2`}>
        <CloseCircleFilled className="mb-6 text-[64px] text-error" />
        <h3 className="mb-3 text-xl font-semibold">Verification Failed</h3>
        <p className="mb-6 w-[323px] text-center text-gray-500">
          {reason ||
            'The information you submitted was determined to be incorrect by the system, please check and resubmit.'}
        </p>
        <Button shape="round" type="primary" size="large" onClick={onClose}>
          Got it
        </Button>
      </div>
    </div>
  )
}

export default function SubmissionResult(props: {
  onClose?: () => void
  result: TSubmitResult | null
  detail: TSubmissionDetail | null
}) {
  const { onClose, result, detail } = props

  if (result?.s1_valid_result) {
    return <SubmissionSuccess detail={detail || undefined} onClose={onClose} onContinue={() => {}} />
  } else {
    return <SubmissionError reason={result?.s1_fail_msg || ''} onClose={onClose} />
  }
}
