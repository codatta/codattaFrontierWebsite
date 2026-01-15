import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { ChevronLeft, TrendingUp, Info, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '@/stores/user.store'
import reputationApi, { ReputationDetail } from '@/apis/reputation.api'
import { Icon1App, Icon2App, Icon3App, Icon4App } from '@/components/settings/reputation/icons-app'
import CategoryCardApp from '@/components/settings/reputation/category-card-app'
import CalculationModalApp from '@/components/settings/reputation/calculation-modal-app'
import IdentityModalApp from '@/components/settings/reputation/identity-modal-app'
import MaliciousCardApp from '@/components/settings/reputation/malicious-card-app'

export default function UserInfoReputationApp() {
  const { info } = useUserStore()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<ReputationDetail>()
  const [loading, setLoading] = useState(false)

  // Modal states
  const [calculationOpen, setCalculationOpen] = useState(false)
  const [identityOpen, setIdentityOpen] = useState(false)

  const userReputation = detail?.reputation ?? info?.user_reputation

  const fetchReputationDetail = () => {
    setLoading(true)
    reputationApi
      .getReputationDetail()
      .then((res) => {
        if (res.success) {
          setDetail(res.data)
        } else {
          message.error(res.errorMessage || 'Fetch reputation detail failed')
        }
      })
      .catch((error) => {
        console.error('Fetch reputation detail failed', error)
        message.error(error.message || 'Fetch reputation detail failed')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchReputationDetail()
  }, [])

  return (
    <div className="min-h-screen bg-[#F5F7FA] pb-10 text-[#1C1C26]">
      <Spin spinning={loading}>
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft className="size-6 text-[#1C1C26]" />
          </button>
          <div className="text-lg font-bold">Reputation</div>
          <button className="p-2">
            <TrendingUp className="size-6 text-[#1C1C26]" />
          </button>
        </div>

        {/* Score Section */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-b from-[#E0F9FD] to-transparent pb-8 pt-6">
          <div className="relative flex items-center">
            <span className="text-[64px] font-bold leading-none text-[#1C1C26]">
              {userReputation?.toFixed(1) ?? '0.0'}
            </span>
            <ChevronRight className="ml-2 size-8 text-[#1C1C26]/30" />
          </div>
          <div
            className="mt-2 flex cursor-pointer items-center gap-1 text-sm text-[#8E8E93]"
            onClick={() => setCalculationOpen(true)}
          >
            Your Reputation <Info className="size-3" />
          </div>

          <div className="mt-8 px-6 text-center text-xs leading-relaxed text-[#8E8E93]">
            Your Reputation is built on identity, activity, stake, and contribution. It identifies and rewards true
            builders, and is your key to greater ecosystem benefits.
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4 px-4">
          <div className="mb-2 text-sm text-[#8E8E93]">Improve reputation through the following methods:</div>

          <CategoryCardApp
            icon={<Icon1App size={40} />}
            title="Verified Identity"
            score={detail?.identify?.score}
            metrics={{
              label: 'Connected',
              value: detail?.identify?.complete ?? 0,
              subValue: detail?.identify?.total ?? 4
            }}
            progress={{
              current: detail?.identify?.complete ?? 0,
              total: detail?.identify?.total ?? 4
            }}
            buttonText="Web"
            onInfoClick={() => setIdentityOpen(true)}
            onButtonClick={() => {}}
            buttonDisabled={true}
          />

          <CategoryCardApp
            icon={<Icon2App size={40} />}
            title="Login Activity"
            score={detail?.login?.score}
            metrics={{
              label: 'Active Days',
              value: detail?.login?.complete ?? 0,
              subValue: detail?.login?.total ?? 180
            }}
            progress={{
              current: detail?.login?.complete ?? 0,
              total: detail?.login?.total ?? 180
            }}
            buttonText="Go"
            onButtonClick={() => navigate('/')}
          />

          <CategoryCardApp
            icon={<Icon3App size={40} />}
            title="Staking Commitment"
            score={detail?.staking?.score}
            metrics={{
              label: 'Staked',
              value: detail?.staking?.value ?? 0,
              subValue: detail?.staking?.total ?? 50000,
              unit: '$XNY'
            }}
            progress={{
              current: detail?.staking?.value ?? 0,
              total: detail?.staking?.total ?? 50000
            }}
            buttonText="Web"
            onButtonClick={() => {}}
            buttonDisabled={true}
          />

          <CategoryCardApp
            icon={<Icon4App size={40} />}
            title="Valuable Contributions"
            score={detail?.contribution?.score}
            metrics={{
              label: 'Accept',
              value: detail?.contribution?.adopt_cnt ?? 0,
              subValue: detail?.contribution?.refuse_cnt ?? 0,
              subLabel: 'Reject'
            }}
            progress={{
              current: detail?.contribution?.adopt_cnt ?? 0,
              total: (detail?.contribution?.adopt_cnt ?? 0) + (detail?.contribution?.refuse_cnt ?? 0) || 100 // Fallback total
            }}
            buttonText="Go"
            onButtonClick={() => navigate('/')}
          />

          {/* Malicious Behavior */}
          <MaliciousCardApp score={detail?.malicious_behavior?.score} />
        </div>
      </Spin>

      {/* About Calculation Modal */}
      <CalculationModalApp open={calculationOpen} onClose={() => setCalculationOpen(false)} data={detail} />

      {/* Identity Modal */}
      <IdentityModalApp open={identityOpen} onClose={() => setIdentityOpen(false)} />
    </div>
  )
}
