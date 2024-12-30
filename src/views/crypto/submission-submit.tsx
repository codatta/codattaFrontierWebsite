import { useNavigate, useSearchParams } from 'react-router-dom'
import { message, Modal } from 'antd'
import SubmissionForm from '@/components/crypto/submission/submission-form'
import { useForm } from 'antd/es/form/Form'
import TransitionEffect from '@/components/common/transition-effect'
import { useEffect, useState } from 'react'
import submissionApi, { TSubmitResult } from '@/api-v1/submission.api'
// import HelpDoc from '@/components/common/help-doc'
// import sideCollapseTheme from '@/styles/bounty-side-collapse'
import ReactGA from 'react-ga4'
import { configStoreActions, useOptions } from '@/stores/config.store'
import SubmissionResult from '@/components/crypto/submission/submission-result'
import { ArrowLeft } from 'lucide-react'
import { TSubmissionDetail } from '@/api-v1/submission.api'

export default function Component() {
  const [form] = useForm()
  const [searchParams] = useSearchParams()
  const [initialValue] = useState()
  const [result, setResult] = useState<TSubmitResult | null>(null)
  const [submission, setSubmission] = useState<TSubmissionDetail | null>(null)
  const [_categoryValue, setCategoryValue] = useState<string[]>([])

  const queryCategory = searchParams.get('category')
  // const [category, setCategory] = useState<string>(queryCategory || '')
  const options = useOptions()
  const navigate = useNavigate()

  // const categoryFilter = (inputValue: string, path: CategoryOption[]) => {
  //   const [_, option] = path
  //   if (!option) return false
  //   return option.label.toLowerCase().startsWith(inputValue.toLowerCase())
  // }

  useEffect(() => {
    if (!queryCategory) return
    setCategoryValue(configStoreActions.getCategoryValueByChild(queryCategory) || [])
  }, [options.categories, queryCategory])

  async function handleSubmitFinish(result: TSubmitResult) {
    try {
      const res = await submissionApi.getSubmissionDetail(result.submission_id)
      setSubmission(res.data)
      ReactGA.event('submission_submit_success', {
        customParams: JSON.stringify({ submission_id: result.submission_id })
      })
    } catch (err) {
      message.error(err.message)
    }
    setResult(result)
  }

  function handleResultClose() {
    form.resetFields()
    setResult(null)
  }

  // function handleCategoryChange(value: string[]) {
  //   setCategoryValue(value)
  //   setCategory(value[value.length - 1])
  // }

  return (
    <TransitionEffect className="m-auto max-w-[1440px]">
      <div className="mb-6 flex items-center gap-2">
        <ArrowLeft size={28} onClick={() => navigate(-1)} className="cursor-pointer" />
        <h1 className="text-2xl font-bold">
          {queryCategory && !['third-party-data', 'personal-data'].includes(queryCategory)
            ? queryCategory
            : 'Submission'}
        </h1>
      </div>
      <div className="flex gap-10 pt-6">
        <div className="flex-1">
          <SubmissionForm form={form} initialValue={initialValue} onFinish={handleSubmitFinish}></SubmissionForm>
        </div>

        {/* <div className="hidden w-px bg-gray-100 lg:flex"></div>

        <div className="hidden w-[400px] flex-col gap-4 lg:flex">
          <div className="rounded-3xl bg-gray-50 p-6">
            <Cascader
              size="large"
              className="w-full"
              options={
                [
                  ...options.categories,
                  {
                    label: 'Tutorial',
                    value: 'Tutorial',
                    children: [
                      { label: 'Personal Data', value: 'personal-data' },
                      { label: 'Third Party Data', value: 'third-party-data' }
                    ]
                  }
                ] as CategoryOption[]
              }
              showSearch={{ filter: categoryFilter }}
              expandTrigger="hover"
              onChange={handleCategoryChange}
              placeholder="Select a category"
              value={categoryValue}
              allowClear={false}
            />
            {category && (
              <>
                <hr className="my-4 border-t-gray-100" />
                <HelpDoc docKey={category}></HelpDoc>
              </>
            )}
          </div>
          <div className="rounded-3xl bg-gray-50 p-6">
            <ConfigProvider theme={sideCollapseTheme}>
              <Collapse
                size="large"
                expandIconPosition="end"
                items={[
                  {
                    key: 1,
                    label: <div className="mb-4 text-base font-bold">What's the next step?</div>,
                    children: <HelpDoc docKey={'whats-next'} className="text-sm"></HelpDoc>
                  },
                  {
                    key: 2,
                    label: <div className="text-base font-bold">How to calculate reward?</div>,
                    children: <HelpDoc docKey={'how-to-calculate'} className="text-sm"></HelpDoc>
                  }
                ]}
                ghost
              ></Collapse>
            </ConfigProvider>
          </div>
        </div> */}
      </div>

      <Modal
        width={800}
        centered
        open={!!result}
        footer={null}
        closable={false}
        onCancel={() => {
          form.resetFields()
          setResult(null)
        }}
      >
        <SubmissionResult result={result} detail={submission} onClose={handleResultClose}></SubmissionResult>
      </Modal>
    </TransitionEffect>
  )
}
