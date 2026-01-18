import { message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '@/stores/user.store'
import reputationApi, { ReputationDetail } from '@/apis/reputation.api'
import { Icon1App, Icon2App, Icon3App, Icon4App } from '@/components/settings/reputation/icons-app'
import CategoryCardApp from '@/components/settings/reputation/category-card-app'
import CalculationModalApp from '@/components/settings/reputation/calculation-modal-app'
import IdentityModalApp from '@/components/settings/reputation/identity-modal-app'
import MaliciousCardApp from '@/components/settings/reputation/malicious-card-app'
import MobileAppFrontierHeader from '@/components/mobile-app/frontier-header'

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
    <div className="min-h-screen bg-gradient-to-br from-[#d3f8fc] to-[#ffe4dd] text-[13px] leading-[17px] text-[#666666]">
      <Spin spinning={loading}>
        <MobileAppFrontierHeader
          title="Reputation"
          onBack={() => navigate(-1)}
          showSubmitButton={false}
          canSubmit={false}
          transparent
        />

        {/* Score Section */}
        <div className="flex flex-col items-center justify-center pb-8 pt-2" onClick={() => setCalculationOpen(true)}>
          <div className="relative flex items-center text-[64px] font-bold leading-[76px]">
            <span className="text-[#1C1C26]">{userReputation?.toFixed(1) ?? '0.0'}</span>
            <ChevronRight className="ml-2 size-8 text-[#1C1C26]/30" />
          </div>

          <div className="mt-1 px-10 text-center">
            Your Reputation is built on identity, activity, stake, and contribution. It identifies and rewards true
            builders, and is your key to greater ecosystem benefits.
          </div>
        </div>

        {/* Categories List */}
        <div className="rounded-t-[26px] bg-[#F5F5F5] p-5 pb-8">
          <div className="mb-4 text-center">Improve reputation through the following methods</div>

          <div className="space-y-6">
            <CategoryCardApp
              icon={<Icon1App />}
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
              icon={<Icon2App />}
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
              icon={<Icon3App />}
              title="Staking Commitment"
              score={detail?.staking?.score}
              metrics={{
                label: 'Staked',
                value: detail?.staking?.complete ?? '0.0',
                subValue: detail?.staking?.total ?? 50000,
                unit: '$XNY'
              }}
              progress={{
                current: detail?.staking?.complete ?? 0,
                total: detail?.staking?.total ?? 50000
              }}
              buttonText="Web"
              onButtonClick={() => {}}
              buttonDisabled={true}
            />

            <CategoryCardApp
              icon={<Icon4App />}
              title="Valuable Contributions"
              score={detail?.contribution?.score}
              metrics={{
                label: 'Accept',
                value: detail?.contribution?.adopt_cnt ?? 0,
                subValue: detail?.contribution?.refuse_cnt ?? 0,
                subLabel: 'Reject'
              }}
              metricsLayout="split"
              progress={{
                current: detail?.contribution?.adopt_cnt ?? 0,
                total: (detail?.contribution?.adopt_cnt ?? 0) + (detail?.contribution?.refuse_cnt ?? 0) || 100
              }}
              progressVariant="contrast"
              buttonText="Go"
              onButtonClick={() => navigate('/')}
            />

            {/* Malicious Behavior */}
            <MaliciousCardApp score={detail?.malicious_behavior?.score} />
          </div>
        </div>
      </Spin>

      {/* About Calculation Modal */}
      <CalculationModalApp open={calculationOpen} onClose={() => setCalculationOpen(false)} data={detail} />

      {/* Identity Modal */}
      <IdentityModalApp open={identityOpen} onClose={() => setIdentityOpen(false)} />
    </div>
  )
}
