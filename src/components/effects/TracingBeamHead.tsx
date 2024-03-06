'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion'

const Tracing = ({
  children,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })

  const contentRef = useRef<HTMLDivElement>(null)
  const [svgHeight, setSvgHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setSvgHeight(contentRef.current.offsetHeight)
      console.log('svg height: ', contentRef.current.offsetHeight)
    }
  }, [])

  const y1 = useSpring(
    useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
    {
      stiffness: 500,
      damping: 90,
    }
  )
  const y2 = useSpring(
    useTransform(scrollYProgress, [0, 1], [50, svgHeight - 200]),
    {
      stiffness: 500,
      damping: 90,
    }
  )

  useMotionValueEvent(y1, 'change', (latest) => {
    console.log('Page scroll: ', latest, y1, y2)
  })

  return (
    <motion.div ref={ref} className="relative w-full h-full">
      <div className="absolute -left-4 md:-left-20 top-3">
        <svg
          viewBox={`0 0 20 ${svgHeight}`}
          width="20"
          height={svgHeight} // Set the SVG height
          className=" ml-4 block"
          aria-hidden="true"
        >
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="#9091A0"
            strokeOpacity="0.16"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 1 0V -36 l 18 24 V ${svgHeight * 0.8} l -18 24V ${svgHeight}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="1.25"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="0"
              x2="0"
              y1={y1} // set y1 for gradient
              y2={y2} // set y2 for gradient
            >
              <stop stopColor="#18CCFC" stopOpacity="0"></stop>
              <stop stopColor="#18CCFC"></stop>
              <stop offset="0.325" stopColor="#6344F5"></stop>
              <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
            </motion.linearGradient>
          </defs>
        </svg>
      </div>
      <div ref={contentRef}>{children}</div>
    </motion.div>
  )
}

export default Tracing

<svg width="48" height="584" viewBox="0 0 48 584" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="22" width="4" height="310" fill="url(#paint0_linear_604_765)"/>
<rect x="22" y="350" width="4" height="234" fill="url(#paint1_linear_604_765)"/>
<g filter="url(#filter0_f_604_765)">
<circle cx="24" cy="330" r="12" fill="#7A24BF" fill-opacity="0.4"/>
</g>
<path d="M24 338.333C28.6024 338.333 32.3333 334.602 32.3333 330C32.3333 325.398 28.6024 321.667 24 321.667C19.3976 321.667 15.6667 325.398 15.6667 330C15.6667 334.602 19.3976 338.333 24 338.333Z" stroke="white" stroke-opacity="0.8" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M19.4167 332.083V327.917L21.9167 329.167L24 326.25L26.0833 329.167L28.5833 327.917V332.083H19.4167Z" stroke="white" stroke-opacity="0.8" stroke-width="0.833333" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<filter id="filter0_f_604_765" x="0" y="306" width="48" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
<feGaussianBlur stdDeviation="6" result="effect1_foregroundBlur_604_765"/>
</filter>
<linearGradient id="paint0_linear_604_765" x1="24" y1="0" x2="24" y2="310" gradientUnits="userSpaceOnUse">
<stop stop-color="#8B3FC6" stop-opacity="0"/>
<stop offset="0.985" stop-color="#5A2485"/>
</linearGradient>
<linearGradient id="paint1_linear_604_765" x1="24" y1="350" x2="24" y2="584" gradientUnits="userSpaceOnUse">
<stop offset="0.215" stop-color="#6C29A0"/>
<stop offset="0.965" stop-color="#00AA51"/>
</linearGradient>
</defs>
</svg>
