import { motion } from 'framer-motion'
import './Card.scss'

type TProps = {
  t1: string
  t2: string
  des: string
  progress: number
  num1?: number
  num2?: number
  des2?: string
}

const Progress = () => {
  return (
    <div className="w-247px h-48px">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="247"
        height="48"
        fill="none"
        viewBox="0 0 247 48"
        className="w-full h-full block"
      >
        <rect
          width="232"
          height="15"
          x=".5"
          y="16.5"
          fill="url(#a)"
          fill-opacity=".1"
          stroke="url(#b)"
          rx="7.5"
        />
        {/* <path fill="url(#c)" d="M1 24a7 7 0 0 1 7-7h207v14H8a7 7 0 0 1-7-7Z" /> */}
        <g filter="url(#d)">
          <circle cx="223" cy="24" r="8" fill="#F838AB" />
          <circle cx="223" cy="24" r="12" stroke="#fff" stroke-width="8" />
        </g>
        <defs>
          <linearGradient
            id="a"
            x1="229.659"
            x2="8.014"
            y1="29.5"
            y2="31.485"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#fff" stop-opacity=".7" />
            <stop offset="1" stop-color="#fff" stop-opacity=".1" />
          </linearGradient>
          <linearGradient
            id="b"
            x1="116.5"
            x2="116.5"
            y1="16"
            y2="32"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#fff" stop-opacity=".3" />
            <stop offset="1" stop-color="#fff" stop-opacity=".2" />
          </linearGradient>
          <linearGradient
            id="c"
            x1="215"
            x2="1"
            y1="24"
            y2="24"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F838AB" />
            <stop offset="1" stop-color="#F8385B" />
          </linearGradient>
          <filter
            id="d"
            width="48"
            height="48"
            x="199"
            y="0"
            color-interpolation-filters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              result="hardAlpha"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="4" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0" />
            <feBlend
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1874_8779"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_dropShadow_1874_8779"
              result="shape"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
const Card = ({ t1, t2, des, progress, num1, num2, des2 }: TProps) => {
  return (
    <div className="w-288px h-219px card-border-3 box-border p-24px card">
      <h4 className="font-bold color-#fff text-sm">
        {t1}
        {t2 && '('}
        <span className="text-xs">{t2}</span>
        {t2 && ')'}
      </h4>
      <p className="text-xs mt-12px color-#fff opacity-65">{des}</p>
      <Progress />
      {!des2 ? (
        <div className="linear">
          {num1}% <span className="small">Earned (+{num2}%)</span>
        </div>
      ) : (
        <div className="linear des2">{des2}</div>
      )}
    </div>
  )
}

export default Card
