'use client'
import React, { useEffect, useRef, useState } from 'react'
import {
  motion,
  useTransform,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from 'framer-motion'

const TracingBeam = ({ children }: { children: React.ReactNode }) => {
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

  //   const y1 = useSpring(
  //     useTransform(scrollYProgress, [0, 0.8], [50, svgHeight]),
  //     {
  //       stiffness: 500,
  //       damping: 90,
  //     }
  //   )
  const y2 = useSpring(useTransform(scrollYProgress, [0, 1], [0, svgHeight]), {
    stiffness: 500,
    damping: 90,
  })

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    console.log('Page scroll: ', latest, y2)
  })

  return (
    <motion.div ref={ref} className="relative">
      <div className="absolute top--12px left--68px">
        <svg
          viewBox={`0 0 48 ${svgHeight}`}
          width="48"
          height={svgHeight} // Set the SVG height
          aria-hidden="true"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="block"
        >
          <motion.path
            d={`M 16 0V ${svgHeight * 2}`}
            fill="none"
            stroke="#9091A0"
            strokeWidth="4"
            strokeOpacity="0.16"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <motion.path
            d={`M 16 0V ${svgHeight * 2}`}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="4"
            className="motion-reduce:hidden"
            transition={{
              duration: 10,
            }}
          ></motion.path>
          <defs>
            {/* <linearGradient
            id="paint0_linear_604_765"
            x1="24"
            y1="44"
            x2="24"
            y2="1095"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#00AA51" />
            <stop offset="0.98" stop-color="#33B3AE" />
          </linearGradient> */}
            <motion.linearGradient
              id="gradient"
              gradientUnits="userSpaceOnUse"
              x1="24"
              // y1="44"
              x2="24"
              y1={24} // set y1 for gradient
              y2={y2} // set y2 for gradient
            >
              {/* <stop stopColor="#18CCFC" stopOpacity="0"></stop> */}
              <stop stopColor="#18CCFC"></stop>
              <stop offset="0.325" stopColor="#6344F5"></stop>
              <stop offset="1" stopColor="#AE48FF" stopOpacity="0"></stop>
              {/* <stop stop-color="#00AA51" stopOpacity="0" />
              <stop stop-color="#00AA51" />
              <stop offset="0.98" stop-color="#33B3AE" />
              <stop offset="1" stop-color="#33B3AE" stopOpacity="0" /> */}
            </motion.linearGradient>
          </defs>
        </svg>
      </div>

      <div ref={contentRef}>{children}</div>
    </motion.div>
  )
}

export default TracingBeam
