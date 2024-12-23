import { useParams, useSearchParams } from 'react-router-dom'
import { message, Modal, Button } from 'antd'
// import AppBlankHeader from '@/components/app-blank-header'
import BountyForm, { BountyFormValues } from '@/components/crypto/bounty/bounty-form'
import { useForm } from 'antd/es/form/Form'
import TransitionEffect from '@/components/common/transition-effect'
import bountyApi, { BountyType, TSubmitResult, TBountyDetail } from '@/api-v1/bounty.api'
import { useEffect, useRef, useState } from 'react'
import { BountySubmitResult } from '@/components/crypto/bounty/bounty-submit-result'
import submissionApi, { TSubmissionDetail } from '@/api-v1/submission.api'
import configApi from '@/api-v1/config.api'
import { getCategoryValueByChild } from '@/stores/config.store'
// import HelpDoc from '@/components/common/help-doc'
// import sideCollapseTheme from '@/styles/bounty-side-collapse'
import RecommendBounty from '@/components/crypto/bounty/recommend-bounty'
import ReactGA from 'react-ga4'
import dayjs from 'dayjs'

function TimeCountDown(props: { duration: number }) {
  const { duration } = props
  const dur = useRef(duration)

  const [displayTime, setDisplayTime] = useState({
    h: 0,
    m: 0,
    s: 0
  })

  function getDisplayTime(duration: number) {
    const dur = dayjs.duration(duration)
    const h = Math.floor(dur.asHours())
    const m = Math.floor(dur.asMinutes()) % 60
    const s = Math.floor(dur.asSeconds()) % 60
    setDisplayTime({ h, m, s })
  }

  useEffect(() => {
    const timer = setInterval(() => {
      dur.current = dur.current - 1000
      getDisplayTime(dur.current)
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="py-6 text-center">
      <span className="mb-4 block text-gray-400">Waiting submit</span>

      <div className="flex justify-center gap-2 text-3xl font-bold leading-6">
        <div>
          <div>{displayTime.h}</div>
          <span className="text-base text-gray-400">hrs</span>
        </div>
        :
        <div>
          <div>{displayTime.m}</div>
          <span className="text-base text-gray-400">min</span>
        </div>
        :
        <div>
          <div>{displayTime.s}</div>
          <span className="text-base text-gray-400">sec</span>
        </div>
      </div>
    </div>
  )
}

export default function Component() {
  const [form] = useForm()
  const [searchParams] = useSearchParams()
  const [initialValue, setInitialValue] = useState<Partial<BountyFormValues>>()
  const [result, setResult] = useState<Partial<TSubmitResult> | null>(null)
  const [submission, setSubmission] = useState<TSubmissionDetail | null>(null)
  const [showCountdownModal, setShowCountdownModal] = useState(false)
  const [bountyInfo, setBountyInfo] = useState<TBountyDetail['basic_info']>()

  const type = searchParams.get('type') as BountyType
  const params = useParams()

  async function getDetail(taskId: string, type: BountyType) {
    try {
      const { data } = await bountyApi.getBountyDetail(taskId, type)
      if (data.basic_info) {
        processInitialValue(data.basic_info)
        setBountyInfo(data.basic_info)
      }
    } catch (err) {
      console.log(err)
    }
  }

  async function processInitialValue(values: TBountyDetail['basic_info']) {
    if (values.entity) {
      const { data } = await configApi.getCategoryByEntity(values.entity)
      const categoryList: string[][] = []
      data.forEach((category) => {
        const item = getCategoryValueByChild(category)
        if (item) {
          categoryList.push(item)
        }
      })
      setInitialValue({ ...values })
      // const category = categoryValue ? categoryValue[0] : null
      // const dockey = category ? category[1] : 'known-address'
      // setDocKey(dockey)
    } else {
      setInitialValue(values)
      // setDocKey('known-address')
    }
  }

  useEffect(() => {
    if (initialValue) form.setFieldsValue(initialValue)
  }, [initialValue, form])

  useEffect(() => {
    if (!params.id) return
    getDetail(params.id, type)
  }, [params.id, type])

  async function handleSubmitFinish(result: TSubmitResult) {
    try {
      const res = await submissionApi.getSubmissionDetail(result.submission_id)
      setSubmission(res.data)
      ReactGA.event('bounty_submit_success', { customParams: JSON.stringify({ submission_id: result.submission_id }) })
    } catch (err) {
      console.log(err)
      message.error(err.message)
    }
    setResult(result)
  }

  async function handleAcceptTask() {
    try {
      await bountyApi.holdBounty(params.id!, type)
      message.success('Hunting task has been held successfully')
      setShowCountdownModal(true)
    } catch (err) {
      message.error(err.message)
    }
  }

  return (
    <TransitionEffect className="">
      {/* <AppBlankHeader /> */}
      <div className="m-auto max-w-[1440px] px-6 pt-6 lg:px-16">
        <div className="flex-1">
          <h1 className="mb-6 text-[32px] font-bold">Bounty Hunting</h1>
          <BountyForm
            taskId={params.id!}
            type={type}
            form={form}
            initialValue={initialValue}
            onFinish={handleSubmitFinish}
          ></BountyForm>
          {!bountyInfo?.gmt_expiration && (
            <div className="mt-2 text-center">
              <Button type="text" shape="round" onClick={handleAcceptTask}>
                Accept the task
              </Button>
            </div>
          )}
          <div className="mt-12">
            <h1 className="mb-4 text-lg font-bold">For you!</h1>
            <RecommendBounty />
          </div>
        </div>

        {/* <div className="w-320px shrink-0">
          <ConfigProvider theme={sideCollapseTheme}>
            <Collapse
              size="large"
              defaultActiveKey={1}
              expandIconPosition="end"
              items={[
                {
                  key: 1,
                  label: <div className="font-700 text-xl">How to collect data?</div>,
                  children: <HelpDoc docKey={docKey} className="text-sm"></HelpDoc>
                }
              ]}
              ghost
            ></Collapse>
          </ConfigProvider>
        </div> */}
      </div>

      <Modal
        width={800}
        centered
        open={!!result}
        footer={null}
        onCancel={() => {
          form.resetFields()
          setResult(null)
        }}
      >
        <BountySubmitResult
          result={result!}
          submission={submission!}
          onClose={() => {
            setResult(null)
          }}
          onRedo={() => {
            form.resetFields()
            setResult(null)
          }}
          onContinue={() => true}
        />
      </Modal>

      <Modal centered open={showCountdownModal} onCancel={() => setShowCountdownModal(false)} footer={null}>
        <TimeCountDown duration={24 * 3600 * 1000}></TimeCountDown>
      </Modal>
    </TransitionEffect>
  )
}
