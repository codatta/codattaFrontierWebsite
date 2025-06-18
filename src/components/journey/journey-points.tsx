import JourneyPointsBg from '@/assets/journey/journey-point-bg.png'
import { Button } from 'antd'

export default function Referral() {
  return (
    <div
      style={{
        backgroundImage: `url(${JourneyPointsBg})`
      }}
      className="bg-top-left w-full rounded-2xl border border-white/5 bg-cover p-6"
    >
      <h2 className="mb-3 text-xl font-bold">Points Earned</h2>
      <div className="flex items-center gap-10">
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-bold">Total 4</span>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold text-primary">4000</span> / <span>5000</span>
            </div>
          </div>
          <div className="h-2 w-full rounded-full bg-white/10">
            <div
              className="h-full w-4/5 rounded-full"
              style={{
                background: 'linear-gradient(90deg, #58E6F3 0%, #79A5FC 34.87%, #D35BFC 67.15%, #FEBCCC 100%), #15CD28'
              }}
            ></div>
          </div>
        </div>
        <div className="ml-auto shrink-0 basis-[72px]">
          <Button type="primary" shape="round" block size="large">
            claim(1)
          </Button>
        </div>
      </div>
    </div>
  )
}
