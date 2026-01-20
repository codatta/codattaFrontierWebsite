import { Button, message, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { Calculator } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useUserStore } from '@/stores/user.store'
import reputationApi, { ReputationDetail } from '@/apis/reputation.api'
import ScoreCard from '@/components/settings/reputation/score-card'
import CalculationCard from '@/components/settings/reputation/calculation-card'
import CategoryCard, { Icon1, Icon2, Icon3, Icon4 } from '@/components/settings/reputation/category-card'
import MaliciousCard from '@/components/settings/reputation/malicious-card'
import TokenStakeModal from '@/components/settings/token-stake-modal'

export default function UserInfoReputation() {
  const { info } = useUserStore()
  const navigate = useNavigate()
  const [detail, setDetail] = useState<ReputationDetail>()
  const [loading, setLoading] = useState(false)
  const [stakeModalOpen, setStakeModalOpen] = useState(false)
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
    <div className="relative min-h-[500px] min-w-[1160px]">
      <Spin spinning={loading} size="large" className="max-h-full">
        <div className="space-y-12 text-white">
          {/* Header */}
          <header className="mb-6">
            <h1 className="flex items-center justify-between text-[32px] font-bold leading-[48px]">
              Reputation{' '}
              <Button
                className="flex items-center gap-1 border-none bg-[#875DFF] px-4 py-2 text-sm text-white hover:!bg-white hover:!text-[875DFF]"
                shape="round"
                onClick={() => window.open('https://docs.codatta.io/en/core-systems/reputation', '_blank')}
              >
                <Calculator size={14} />
                Calculation Rules
              </Button>
            </h1>
            <p className="mt-1 text-sm text-[#BBBBBE]">
              Your Reputation is built on identity, activity, stake, and contribution. It identifies and rewards true
              builders, and is your key to greater ecosystem benefits.
            </p>
          </header>

          {/* Top Section */}
          <div className="flex items-stretch gap-6">
            <ScoreCard score={userReputation} className="min-w-[316px]" />
            <CalculationCard data={detail} className="flex-1" />
          </div>

          {/* Categories Section */}
          <div className="mb-6">
            <h2 className="mb-4 text-lg font-bold">How Your Score is Calculated</h2>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Verified Identity */}
              <CategoryCard
                icon={<Icon1 size={48} />}
                title="Verified Identity"
                score={detail?.identify?.score}
                metrics={{
                  label: 'Connected',
                  value: detail?.identify?.complete ?? '--',
                  subValue: detail?.identify?.total ?? '--'
                }}
                progress={{
                  current: detail?.identify?.complete || 0,
                  total: detail?.identify?.total || 1
                }}
                buttonText="Connect Accounts"
                onButtonClick={() => navigate('/app/settings/personal')}
                description="Verify your social accounts (Email, X, Telegram, Discord)."
              />

              {/* Login Activity */}
              <CategoryCard
                icon={<Icon2 size={48} />}
                title="Login Activity"
                score={detail?.login?.score}
                metrics={{
                  label: 'Active Days',
                  value: detail?.login?.complete ?? '--',
                  subValue: detail?.login?.total ?? '--'
                }}
                progress={{
                  current: detail?.login?.complete || 0,
                  total: detail?.login?.total || 1
                }}
                buttonText="Done"
                buttonDisabled={true}
                onButtonClick={() => message.success('Daily login recorded', 2000)}
                description="Log in daily to maintain activity (measured over a rolling 180-day period)."
              />

              {/* Staking Commitment */}
              <CategoryCard
                icon={<Icon3 size={48} />}
                title="Staking Commitment"
                score={detail?.staking?.score}
                metrics={{
                  label: 'Staked',
                  value: detail?.staking?.complete?.toLocaleString() ?? '--',
                  subValue:
                    detail?.staking?.total != null
                      ? `${detail?.staking?.total?.toLocaleString()} ${detail?.staking?.unit || ''}`
                      : '--'
                }}
                progress={{
                  current: detail?.staking?.complete || 0,
                  total: detail?.staking?.total || 1
                }}
                buttonText="Stake Now"
                onButtonClick={() => setStakeModalOpen(true)}
                description="Stake $XNY to increase your score (Max: 50,000 $XNY, Rate: 2,500 $XNY/Point)."
              />

              {/* Valuable Contributions */}
              <CategoryCard
                icon={<Icon4 size={48} />}
                title="Valuable Contributions"
                score={detail?.contribution?.score}
                metrics={{
                  label: `Accept: ${detail?.contribution?.adopt_cnt ?? '--'}`,
                  value: `Reject: ${detail?.contribution?.refuse_cnt ?? '--'}`
                }}
                progress={{
                  type: 2,
                  current: detail?.contribution?.adopt_cnt || 0,
                  total: (detail?.contribution?.adopt_cnt || 0) + (detail?.contribution?.refuse_cnt || 0) || 1
                }}
                buttonText="Contribute Now"
                onButtonClick={() => navigate('/app')}
                description="Submit high-quality data to improve your acceptance rate."
              />
            </div>
          </div>

          {/* Malicious Behavior */}
          <MaliciousCard
            score={detail?.malicious_behavior?.score}
            description="Trigger: Only applies to confirmed malicious activities (e.g., script attacks, data poisoning). Operational errors are excluded."
          />
        </div>
      </Spin>

      {stakeModalOpen && (
        <TokenStakeModal
          open={true}
          onClose={() => setStakeModalOpen(false)}
          onSuccess={fetchReputationDetail}
          taskStakeConfig={{ stake_asset_type: 'XnYCoin' }}
        />
      )}
    </div>
  )
}
