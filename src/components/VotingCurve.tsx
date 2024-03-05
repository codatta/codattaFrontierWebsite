import { useRef } from 'react'
import { useScroll, useTransform, motion, MotionValue } from 'framer-motion'

import {
  path1,
  path2,
  path3,
  path4,
  path5,
  path6,
  path7,
  path8,
} from './pathes/votingCurve'

import './VotingCurve.scss'

const transition = {
  duration: 0,
  ease: 'linear',
}

export default function VotingCurve() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const pathLength = useTransform(scrollYProgress, [0, 0.8], [0.2, 1.2])

  return (
    <div
      className="voting-curve flex flex-col justify-between p-[32px]"
      ref={ref}
    >
      {/* <svg
        width="1200"
        height="491"
        viewBox="0 0 1200 491"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-ful h-full"
      >
        <g filter="url(#filter0_b_1454_6651)">
          <rect
            width="1200"
            height="491"
            rx="16"
            fill="url(#paint0_linear_1454_6651)"
          />
          <rect
            x="0.5"
            y="0.5"
            width="1199"
            height="490"
            rx="15.5"
            stroke="url(#paint1_linear_1454_6651)"
          />
        </g>
        <path d={path1} fill="white" fill-opacity="0.85" />
        <path d={path2} fill="white" fill-opacity="0.45" />
        <path d={path3} fill="white" />
        <path d={path4} fill="white" fill-opacity="0.45" />
        <path d={path5} fill="url(#paint2_linear_1454_6651)" />
        <path d={path6} fill="url(#paint3_linear_1454_6651)" />
        <path
          d="M32 219H1168"
          stroke="white"
          stroke-opacity="0.15"
          stroke-width="4"
          stroke-dasharray="8 4"
        />
        <path
          d={path7}
          fill="url(#paint4_linear_1454_6651)"
          fill-opacity="0.1"
        />
        <path
          d={path8}
          stroke="url(#paint5_linear_1454_6651)"
          stroke-width="4"
        />
        <defs>
          <filter
            id="filter0_b_1454_6651"
            x="-28"
            y="-28"
            width="1256"
            height="547"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="14" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1454_6651"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1454_6651"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_1454_6651"
            x1="565.716"
            y1="-9.13001e-05"
            x2="561.601"
            y2="491.171"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" stop-opacity="0.01" />
            <stop offset="1" stop-color="white" stop-opacity="0.04" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1454_6651"
            x1="600"
            y1="0"
            x2="600"
            y2="491"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#EFF6FF" stop-opacity="0.11" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_1454_6651"
            x1="95.5"
            y1="364"
            x2="96"
            y2="432"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="white" />
            <stop offset="1" stop-color="white" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_1454_6651"
            x1="1148"
            y1="67"
            x2="1017"
            y2="67"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F838AB" />
            <stop offset="1" stop-color="#E5E5E5" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_1454_6651"
            x1="557"
            y1="157.5"
            x2="556.2"
            y2="360.997"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF00B8" />
            <stop offset="1" stop-color="#FF00B8" stop-opacity="0" />
          </linearGradient>
          <linearGradient
            id="paint5_linear_1454_6651"
            x1="557"
            y1="94"
            x2="557"
            y2="363.577"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#FF00B8" />
            <stop offset="1" stop-color="white" stop-opacity="0.23" />
          </linearGradient>
        </defs>
      </svg> */}
      <div className="flex  justify-between h-[130px] ">
        <div className="font-semibold">Aggregate Opinion</div>
        <div className="">
          <div className="font-bold score score-1">90.0%</div>
          <div className="font-normal opacity-45">After</div>
        </div>
      </div>
      <div className="flex justify-between h-[130px]">
        <div className="">
          <div className="font-bold score score-2">86.4%</div>
          <div className="font-normal opacity-45">Before</div>
        </div>
        <div className="opacity-85">
          We integrate multiple insights <br />
          on each address using a <br />
          majority voting algorithm to <br />
          approximate truth.
        </div>
      </div>
    </div>
  )
}
