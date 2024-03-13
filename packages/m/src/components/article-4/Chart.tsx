import { useEffect, useState } from 'react'
import './Chart.scss'
import { motion, animate } from 'framer-motion'

const Chart = ({ open }: { open: boolean }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    animate(progress, open ? 1 : 0, {
      duration: 2,
      onUpdate: (latest) => setProgress(latest),
    })
  }, [open])

  return (
    <div className="chart card-border-1 w-297px h-318px box-border p-24px relative mt-16px">
      <div className="text-sm color-#fff font-bold">
        Approximate <span className="color-#F55AB7">Ground Truth</span> with
        Aggregated Opinions
      </div>
      <div className="mt-14px flex flex-col justify-between">
        <div className="text-xs">
          <div className="flex justify-between">
            <div>Accuracy </div>
            <div className="w-160px">
              <div className="color-#fff opacity-85 text-right">
                <span className="font-bold">WMV</span> {'('}Weighted Majority
                <br />
                Voting{')'} Algorithm
              </div>
              <div className="flex justify-end">
                <div className="num-1 mt-30px">
                  <span className="text-base font-bold">
                    {(90 * progress).toFixed(1)}
                  </span>
                  <span className="text-xs">%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs color-#fff  mt-0px text-center font-bold pt-12px line">
            8 Independent Contributors
          </div>
        </div>
        <div className="mt-40px">
          <span className="num-2 text-base font-bold">
            {(20 * progress).toFixed(1)}
          </span>
          <span className="text-10px">
            %{'('}a single contributor{')'}
          </span>
        </div>
        <div className="text-8px leading-12px arrow mt-5px h-17px text-right">
          No. of Contributors per Addresss
        </div>
      </div>
      <motion.div className="absolute left-22px top-133px w-250px h-86px">
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          width="1087"
          height="311"
          fill="none"
          viewBox="0 0 1087 311"
          className="w-full h-full block"
        >
          <motion.path
            stroke="url(#a)"
            strokeWidth="8"
            animate={{ pathLength: 1 }}
            d="M4 310.572c4.85-51.234 19.75-143.015 60.808-143.015 66.006-30.537 53.533-87.03 117.979-87.03 36.381-2.036 28.066-26.466 51.454-26.466 23.387 0 58.729-18.831 85.755-26.465 27.026-7.634 78.999-20.868 88.874-15.269 9.875 5.6 41.579 5.6 41.579 5.6s51.453-19.851 91.992-9.163c40.539 10.69 58.729 8.652 113.301 0 54.572-8.65 424.618-3.562 428.258 0"
          />
          <motion.circle
            cx="128.292"
            cy="107"
            r="10"
            fill="#F838AB"
            stroke="#fff"
            strokeWidth="4"
            animate={{ opacity: 1, strokeWidth: 1 }}
          />
          <defs>
            <linearGradient
              id="a"
              x1="534.761"
              x2="534.761"
              y1="-.632"
              y2="307.234"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F838AB" />
              <stop offset="1" stopColor="#D0CCC8" stopOpacity=".23" />
            </linearGradient>
          </defs>
        </motion.svg>
      </motion.div>
    </div>
  )
}

export default Chart
