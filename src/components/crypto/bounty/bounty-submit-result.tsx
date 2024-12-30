import { TSubmitResult } from '@/api-v1/bounty.api'
import { TSubmissionDetail } from '@/api-v1/submission.api'
import SubmissionProgress from '@/components/crypto/submission/submission-progress'
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Button } from 'antd'
import { useState } from 'react'

export function BountySubmitResult(props: {
  result: Partial<TSubmitResult>
  submission?: TSubmissionDetail
  onClose: () => void
  onRedo: () => void
  onContinue?: () => void
}) {
  const { result, submission } = props
  const [errorMsg, setErrorMsg] = useState('')

  return !result.error ? (
    <div className="flex flex-col items-center text-center">
      {result.s1_valid_result ? (
        <>
          <CheckCircleFilled className="mb-6 text-[64px] text-success" />
          <p className="mb-3 text-base font-bold">Verification successful</p>
          <p className="inline-block w-[480px] text-gray-600">
            Congratulations on earning <span>{submission?.reward?.current_point} points</span>. Upon completing the
            entire process, you will receive more points.
          </p>
        </>
      ) : (
        <>
          <div>
            <div className={`flex flex-col items-center`}>
              <CloseCircleFilled className="mb-6 text-[64px] text-error" />
              <h3 className="mb-3 text-base font-bold">Verification Failed</h3>
              <p className="w-[480px] text-center text-gray-600">
                {errorMsg ||
                  'The information you submitted was determined to be incorrect by the system, please check and resubmit.'}
              </p>
            </div>
          </div>
        </>
      )}
      <div className="my-8 w-full rounded-xl bg-gray-200 px-4 py-6">
        {submission?.reward && (
          <SubmissionProgress
            reward={submission?.reward}
            tooltipTitle="Progress bar shows earned points, upcoming steps, and estimated time for each step."
            onPopErrMsg={setErrorMsg}
          />
        )}
      </div>

      {result.s1_valid_result ? (
        <div className="flex w-full justify-center gap-2">
          <Button className="min-w-40 px-2" shape="round" type="primary" size="large" onClick={props.onRedo}>
            Got it
          </Button>
        </div>
      ) : (
        <Button shape="round" type="primary" size="large" onClick={props.onRedo}>
          Got it
        </Button>
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center py-8">
      <CloseCircleFilled className="mb-6 text-[64px] text-error" />
      <h3 className="mb-3 text-base font-semibold">Verification Failed</h3>
      <p className="mb-6 w-[323px] text-center">
        {result.fail_reason ||
          'The information you submitted was determined to be incorrect by the system, please check and resubmit.'}
      </p>
      <Button className="min-w-40" type="primary" size="large" onClick={props.onRedo}>
        Got it
      </Button>
    </div>
  )
}
