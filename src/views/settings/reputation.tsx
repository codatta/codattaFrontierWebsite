import ReputationRate from '@/components/common/reputation-rate'
import ReputationRecords from '@/components/reputation/reputation-records'
import TransitionEffect from '@/components/common/transition-effect'
import { useEffect, useState } from 'react'

// import { TourType } from '@/api/tour.api'
import userApi from '@/apis/user.api'
// import Tour from '@/components/tour/tour'

export default function Component() {
  const [reputation, setReputation] = useState('0')
  const [rate, setRate] = useState<number>(0)

  useEffect(() => {
    userApi.getReputation().then((res) => {
      setReputation(res)
      let tempRate = parseFloat(res)
      if (Number.isNaN(tempRate)) tempRate = 0
      if (tempRate < 0) tempRate = 0
      if (tempRate > 5) tempRate = 5

      setRate(tempRate)
    })
  }, [])

  return (
    <div className="flex-auto">
      <TransitionEffect className="px-6">
        <div className="flex justify-between">
          <div className="mb-4 flex items-center gap-4">
            {/* <span className="text-20px font-600 leading-30px mr-1">L{rate}</span> */}
            <span>Reputation</span>
            <ReputationRate
              rate={reputation}
              size={24}
              color={'rgba(255, 168, 0, 0.88)'}
            ></ReputationRate>
          </div>
          {/* <div className="m-b-16px">
            <ReputationRate rate={reputation} size={24} color={'rgba(255, 168, 0, 0.88)'}></ReputationRate>
          </div> */}
        </div>

        <ReputationRecords></ReputationRecords>
        {/* <Tour name={TourType.Reputation} /> */}
      </TransitionEffect>
    </div>
  )
}
