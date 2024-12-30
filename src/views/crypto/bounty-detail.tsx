import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { Button, Collapse, ConfigProvider, message } from 'antd'
import TransitionEffect from '@/components/common/transition-effect'
import BountyDetailList from '@/components/crypto/bounty/bounty-detail-list'
import { useEffect, useState } from 'react'
import bountyApi, { BountyType, TBountyDetail } from '@/api-v1/bounty.api'
import { Plus } from 'lucide-react'
import HelpDoc from '@/components/common/help-doc'
import sideCollapseTheme from '@/styles/bounty-side-collapse'
import RecommendBounty from '@/components/crypto/bounty/recommend-bounty'
import ReactGA from 'react-ga4'

export default function Component() {
  const [detail, setDetail] = useState<TBountyDetail>()
  const [searchParams] = useSearchParams()
  const params = useParams()
  const type = searchParams.get('type') as BountyType
  // const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function getDetail(taskId: string, type: BountyType) {
    try {
      const res = await bountyApi.getBountyDetail(taskId, type)
      setDetail(res.data)
    } catch (err) {
      message.error(err.message)
    }
  }

  useEffect(() => {
    if (!params.id) return
    getDetail(params.id, type)
  }, [params, type])

  function handleSubmitButtonClick() {
    ReactGA.event('bounty_detail_submit_click', { customParams: JSON.stringify({ task_id: params.id }) })
    navigate(`/app/bounty/${params.id}/submit?type=${type}`)
  }

  function SubmitButton() {
    return (
      <Button shape="round" type="primary" size="large" className="ml-auto" onClick={handleSubmitButtonClick}>
        <Plus size={16} />
        Submit
      </Button>
    )
  }

  return (
    <TransitionEffect className="">
      {/* <AppBlankHeader /> */}
      <div className="m-auto flex max-w-[1440px] gap-10 px-[72px] pt-6">
        <div className="min-w-0 flex-1 border-r border-gray-100 pr-10">
          <div className="mb-6 flex items-center">
            <h1 className="text-[32px] font-bold">Bounty Hunting</h1>
            {detail?.is_submit && <SubmitButton></SubmitButton>}
          </div>
          <div className="w-full overflow-x-scroll">
            <BountyDetailList list={detail?.list || []} />
          </div>
          <div className="mt-12">
            <h1 className="mb-4 text-lg font-bold">For you!</h1>
            <RecommendBounty />
          </div>
        </div>

        <div className="w-[320px] shrink-0">
          <ConfigProvider theme={sideCollapseTheme}>
            <Collapse
              size="large"
              defaultActiveKey={1}
              expandIconPosition="end"
              items={[
                {
                  key: 1,
                  label: <div className="text-xl font-bold">What's the next step?</div>,
                  children: <HelpDoc docKey={'whats-next'} className="text-sm"></HelpDoc>
                },
                {
                  key: 2,
                  label: <div className="text-xl font-bold">How to calculate reward?</div>,
                  children: <HelpDoc docKey={'how-to-calculate'} className="text-sm"></HelpDoc>
                }
              ]}
              ghost
            ></Collapse>
          </ConfigProvider>
        </div>
      </div>
    </TransitionEffect>
  )
}
