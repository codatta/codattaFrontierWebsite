import { Button } from 'antd'
import { Calculator, ShieldCheck, LogIn, FileText, Trophy } from 'lucide-react'

import { useUserStore } from '@/stores/user.store'
import ScoreCard from '@/components/reputation/score-card'
import CalculationCard from '@/components/reputation/calculation-card'
import CategoryCard from '@/components/reputation/category-card'
import MaliciousCard from '@/components/reputation/malicious-card'

export default function UserInfoReputation() {
  const { info } = useUserStore()
  const userReputation = info?.user_reputation || 0

  return (
    <div className="min-h-screen space-y-12 text-white">
      {/* Header */}
      <header className="mb-6">
        <h1 className="flex items-center justify-between text-[32px] font-bold leading-[48px]">
          Reputation{' '}
          <Button
            className="flex items-center gap-1 border-none bg-[#875DFF] px-4 py-2 text-sm text-white hover:bg-[#764CE0] hover:text-white"
            shape="round"
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
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <ScoreCard score={79.8} />
        <CalculationCard />
      </div>

      {/* Categories Section */}
      <div className="mb-6">
        <h2 className="mb-6 text-xl font-bold">How Your Score is Calculated</h2>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Verified Identity */}
          <CategoryCard
            icon={<ShieldCheck size={24} />}
            title="Verified Identity"
            score={7.5}
            metrics={{
              label: 'Connected',
              value: 2,
              subValue: 4
            }}
            progress={{
              current: 2,
              total: 4
            }}
            buttonText="Connect Accounts"
            onButtonClick={() => {}}
            description="Verify your social accounts (Email, X, Telegram, Discord)."
          />

          {/* Login Activity */}
          <CategoryCard
            icon={<LogIn size={24} />}
            title="Login Activity"
            score={5.0}
            metrics={{
              label: 'Active Days',
              value: 90,
              subValue: 180
            }}
            progress={{
              current: 90,
              total: 180
            }}
            buttonText="Login"
            onButtonClick={() => {}}
            description="Log in daily to maintain activity (measured over a rolling 180-day period)."
          />

          {/* Staking Commitment */}
          <CategoryCard
            icon={<FileText size={24} />}
            title="Staking Commitment"
            score={4.0}
            metrics={{
              label: 'Staked',
              value: '10,000',
              subValue: '50,000$XNY'
            }}
            progress={{
              current: 10000,
              total: 50000
            }}
            buttonText="Stake Now"
            onButtonClick={() => {}}
            description="Stake $XNY to increase your score (Max: 50,000 $XNY)."
          />

          {/* Valuable Contributions */}
          <CategoryCard
            icon={<Trophy size={24} />}
            title="Valuable Contributions"
            score={27.5}
            metrics={{
              label: 'Accept:50',
              value: 'Reject:30'
            }}
            progress={{
              current: 50,
              total: 80
            }}
            buttonText="Contribute Now"
            onButtonClick={() => {}}
            description="Submit high-quality data to improve your acceptance rate."
          />
        </div>
      </div>

      {/* Malicious Behavior */}
      <MaliciousCard
        score={-10.0}
        description="Trigger: Only applies to confirmed malicious activities (e.g., script attacks, data poisoning). Operational errors are excluded."
      />
    </div>
  )
}
