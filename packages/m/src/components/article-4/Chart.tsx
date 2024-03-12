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
    <div className="chart card-border-2 w-1200px h-573px box-border p-32px relative">
      <div className="text-xl color-#fff font-bold">
        Approximate <span className="color-#F55AB7">Ground Truth</span> with
        Aggregated Opinions
      </div>
      <div className="mt-30px ml-24px w-1088px h-427px flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <div>Accuracy </div>
            <div>
              <div className="color-#fff opacity-85">
                <span className="font-bold">WMV</span> {'('}Weighted Majority
                Voting{')'} Algorithm
              </div>
              <div className="flex justify-end">
                <div className="num-1 w-136px mt-75px">
                  <span className="text-40px leading-48px font-bold">
                    {(90 * progress).toFixed(1)}
                  </span>
                  <span className="text-24px">%</span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-xl color-#fff  mt-10px pl-163px font-bold pt-12px line">
            8 Independent Contributors
          </div>
        </div>
        <div className="flex justify-between h-56px">
          <div>
            <span className="num-2 text-40px leading-48px font-bold w-350px">
              {(20 * progress).toFixed(1)}
            </span>
            <span>
              %{'('}a single contributor{')'}
            </span>
          </div>
          <div className="text-base arrow h-full">
            No. of Contributors per Addresss
          </div>
        </div>
      </div>
      <motion.div className="absolute left-64px top-143px w-1087px h-311px">
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
            animate={{ pathLength: progress }}
            d="M4 310.572c4.85-51.234 19.75-143.015 60.808-143.015 66.006-30.537 53.533-87.03 117.979-87.03 36.381-2.036 28.066-26.466 51.454-26.466 23.387 0 58.729-18.831 85.755-26.465 27.026-7.634 78.999-20.868 88.874-15.269 9.875 5.6 41.579 5.6 41.579 5.6s51.453-19.851 91.992-9.163c40.539 10.69 58.729 8.652 113.301 0 54.572-8.65 424.618-3.562 428.258 0"
          />
          <motion.circle
            cx="128.292"
            cy="107"
            r="10"
            fill="#F838AB"
            stroke="#fff"
            strokeWidth="4"
            animate={{ opacity: progress, strokeWidth: 4 * progress }}
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
