import { MotionValue, motion, useTransform } from 'framer-motion'
import './Chart.scss'

const Chart = ({ progress }: { progress: any }) => {
  const path1 = useTransform(progress, [0, 0.2], [0, 1])

  return (
    <motion.div className="chart w-663px h-471px relative">
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width="663"
        height="471"
        fill="none"
        viewBox="0 0 663 471"
        className="w-full h-full block"
      >
        {/* <motion.g clipPath="url(#a-1)"> */}
        <circle cx="339.35" cy="229.912" r="120.265" stroke="url(#b)" />
        <circle cx="339.35" cy="229.912" r="180.647" stroke="url(#c)" />
        <circle cx="339.35" cy="229.912" r="241.03" stroke="url(#d)" />
        <circle cx="339.35" cy="229.912" r="301.412" stroke="url(#e)" />
        <g filter="url(#f)">
          <circle cx="45.287" cy="101.544" r="45.287" fill="url(#g)" />
          <circle cx="45.287" cy="101.544" r="44.787" stroke="url(#h)" />
        </g>
        <path fill="url(#i)" d="M22.137 79.249h46.299v45.618H22.137z" />
        <g filter="url(#j)">
          <circle cx="94.197" cy="387.153" r="53.137" fill="url(#k)" />
          <circle cx="94.197" cy="387.153" r="52.637" stroke="url(#l)" />
        </g>
        <path fill="url(#m)" d="M69.304 359.736h49.463v54.833H69.304z" />
        <g filter="url(#n)">
          <circle cx="345.388" cy="224.12" r="70.044" fill="url(#o)" />
          <circle cx="345.388" cy="224.12" r="69.544" stroke="url(#p)" />
        </g>
        <path
          name="center-icon"
          fill="url(#q)"
          fillRule="evenodd"
          d="M346.765 189.183a2.425 2.425 0 0 1 1.271 0l25.763 7.027a2.415 2.415 0 0 1 1.78 2.33v9.076a2.415 2.415 0 0 1-2.415 2.415h-.805v33.814h2.415a2.415 2.415 0 0 1 2.415 2.415v7.246h2.416a2.416 2.416 0 0 1 0 4.831h-64.408a2.416 2.416 0 0 1 0-4.831h2.415v-7.246a2.415 2.415 0 0 1 2.415-2.415h2.415v-33.814h-.805a2.415 2.415 0 0 1-2.415-2.415v-9.076c0-1.089.729-2.044 1.78-2.33l25.763-7.027Zm-21.903 59.493h-2.42v4.83h49.917v-4.83h-47.497Zm8.852-4.831h-6.441v-33.814h6.441v33.814Zm4.83 0h6.441v-33.814h-6.441v33.814Zm11.272 0h6.441v-33.814h-6.441v33.814Zm11.271 0h6.441v-33.814h-6.441v33.814Z"
          clipRule="evenodd"
        />
        <g filter="url(#r)">
          <circle cx="603.221" cy="99.128" r="59.779" fill="url(#s)" />
          <circle cx="603.221" cy="99.128" r="59.279" stroke="url(#t)" />
        </g>
        <path
          name="left-center-icon"
          fill="url(#E)"
          d="M96.255 219.744a21.113 21.113 0 0 0-12.204 4.592 21.351 21.351 0 0 0-7.233 10.91 21.48 21.48 0 0 0 .47 13.108 21.326 21.326 0 0 0 7.997 10.357 14.138 14.138 0 0 1-8.878-4.309 14.319 14.319 0 0 1-3.942-9.094 21.308 21.308 0 0 0 4.371 12.426 21.077 21.077 0 0 0 10.816 7.431 20.95 20.95 0 0 0 13.088-.434 21.106 21.106 0 0 0 10.308-8.13 14.185 14.185 0 0 1-4.244 8.85 14.003 14.003 0 0 1-8.946 3.932 20.99 20.99 0 0 0 12.317-4.513 21.228 21.228 0 0 0 7.287-10.97 21.353 21.353 0 0 0-.563-13.184 21.198 21.198 0 0 0-8.193-10.3 14.134 14.134 0 0 1 8.954 4.271 14.314 14.314 0 0 1 3.989 9.132 21.313 21.313 0 0 0-4.431-12.448 21.076 21.076 0 0 0-10.892-7.39 20.954 20.954 0 0 0-13.124.537 21.107 21.107 0 0 0-10.26 8.256 14.31 14.31 0 0 1 4.243-9.015 14.13 14.13 0 0 1 9.07-4.015Zm2.078 16.228a8.737 8.737 0 0 1 5.555 3.222 8.847 8.847 0 0 1 1.884 6.169 8.831 8.831 0 0 1-2.798 5.807 8.722 8.722 0 0 1-5.98 2.328 8.49 8.49 0 0 1-6.163-2.606 8.83 8.83 0 0 1-2.43-4.832 8.865 8.865 0 0 1 .836-5.352 8.782 8.782 0 0 1 3.788-3.847 8.703 8.703 0 0 1 5.308-.889Z"
        />
        <path
          name="right-top-icon"
          fill="url(#u)"
          fillRule="evenodd"
          d="M624.883 77.995a2.038 2.038 0 0 0-2.29-2.023l-43.475 5.435a2.025 2.025 0 0 0-1.107.503 2.038 2.038 0 0 0-.679 1.519v32.606c0 1.039.781 1.911 1.813 2.026l48.91 5.434a2.036 2.036 0 0 0 2.263-2.025V88.863c0-1.038-.781-1.91-1.813-2.025l-3.622-.402v-8.442Zm-4.076 7.988v-5.68l-24.055 3.007 24.055 2.673Z"
          clipRule="evenodd"
        />
        <path
          name="right-bottom-icon"
          fill="url(#I)"
          fillRule="evenodd"
          d="M597.303 324.121c-1.993.996-2.536 2.038-2.536 2.649 0 .612.543 1.653 2.536 2.65 1.884.942 4.615 1.577 7.729 1.577 3.115 0 5.845-.635 7.73-1.577 1.992-.997 2.535-2.038 2.535-2.65 0-.611-.543-1.653-2.535-2.649-1.885-.942-4.615-1.577-7.73-1.577-3.114 0-5.845.635-7.729 1.577Zm-1.62-3.241c-2.378 1.189-4.539 3.167-4.539 5.89v33.815c0 2.723 2.161 4.7 4.539 5.889 2.486 1.244 5.794 1.96 9.349 1.96 3.555 0 6.863-.716 9.35-1.96.994-.497 1.95-1.132 2.727-1.902.776.77 1.732 1.405 2.727 1.902 2.486 1.244 5.794 1.96 9.349 1.96 3.555 0 6.863-.716 9.35-1.96 2.378-1.189 4.538-3.166 4.538-5.889v-16.908c0-2.723-2.16-4.701-4.538-5.89-2.487-1.243-5.795-1.959-9.35-1.959-3.555 0-6.863.716-9.349 1.959-.311.156-.617.324-.916.506V326.77c0-2.723-2.16-4.701-4.538-5.89-2.487-1.243-5.795-1.959-9.35-1.959-3.555 0-6.863.716-9.349 1.959Zm23.237 28.182v3.069c0 .612.543 1.653 2.536 2.649 1.885.943 4.615 1.578 7.729 1.578 3.115 0 5.845-.635 7.729-1.578 1.993-.996 2.536-2.037 2.536-2.649v-3.069c-.298.182-.605.35-.915.505-2.487 1.243-5.795 1.96-9.35 1.96-3.555 0-6.863-.717-9.349-1.96a12.394 12.394 0 0 1-.916-.505Zm0 8.453v3.07c0 .611.543 1.653 2.536 2.649 1.885.942 4.615 1.577 7.729 1.577 3.115 0 5.845-.635 7.729-1.577 1.993-.996 2.536-2.038 2.536-2.649v-3.07c-.298.182-.605.351-.915.506-2.487 1.243-5.795 1.96-9.35 1.96-3.555 0-6.863-.717-9.349-1.96a12.406 12.406 0 0 1-.916-.506Zm-3.623-13.838v-3.069c-.298.182-.605.351-.915.506-2.487 1.243-5.795 1.96-9.35 1.96-3.555 0-6.863-.717-9.349-1.96a12.406 12.406 0 0 1-.916-.506v3.069c0 .612.543 1.653 2.536 2.65 1.885.942 4.615 1.577 7.729 1.577 3.115 0 5.845-.635 7.729-1.577 1.993-.997 2.536-2.038 2.536-2.65Zm0 16.908v-3.07c-.298.182-.605.351-.915.506-2.487 1.243-5.795 1.96-9.35 1.96-3.555 0-6.863-.717-9.349-1.96a12.406 12.406 0 0 1-.916-.506v3.07c0 .611.543 1.653 2.536 2.649 1.885.942 4.615 1.577 7.729 1.577 3.115 0 5.845-.635 7.729-1.577 1.993-.996 2.536-2.038 2.536-2.649Zm0-8.454v-3.069c-.298.182-.605.35-.915.505-2.487 1.243-5.795 1.96-9.35 1.96-3.555 0-6.863-.717-9.349-1.96a12.394 12.394 0 0 1-.916-.505v3.069c0 .612.543 1.653 2.536 2.649 1.885.943 4.615 1.578 7.729 1.578 3.115 0 5.845-.635 7.729-1.578 1.993-.996 2.536-2.037 2.536-2.649Zm-20.53-16.907c0 .611.543 1.653 2.536 2.649 1.885.943 4.615 1.578 7.729 1.578 3.115 0 5.845-.635 7.729-1.578 1.993-.996 2.536-2.038 2.536-2.649v-3.069c-.298.181-.605.35-.915.505-2.487 1.243-5.795 1.96-9.35 1.96-3.555 0-6.863-.717-9.349-1.96a12.774 12.774 0 0 1-.916-.505v3.069Zm26.689 5.804c-1.993.996-2.536 2.038-2.536 2.649 0 .612.543 1.653 2.536 2.65 1.884.942 4.615 1.577 7.729 1.577 3.115 0 5.845-.635 7.73-1.577 1.992-.997 2.535-2.038 2.535-2.65 0-.611-.543-1.653-2.535-2.649-1.885-.942-4.615-1.577-7.73-1.577-3.114 0-5.845.635-7.729 1.577Z"
          clipRule="evenodd"
        />
        <motion.g filter="url(#A)">
          <circle cx="134.049" cy="99.732" r="6.038" fill="#fff" />
          <circle
            cx="134.049"
            cy="99.732"
            r="8.038"
            stroke="#04D898"
            strokeOpacity=".8"
            strokeWidth="4"
          />
        </motion.g>
        <motion.path
          fill="url(#v)"
          stroke="url(#v)"
          strokeWidth="2"
          //   fill="url(#v)"
          //   fillRule="evenodd"
          d="M89.366 101.732h62.951c12.15 0 22 9.85 22 22v46.197c0 14.359 11.64 26 26 26h67.781v6.367l7.246-8.367-7.246-8.367v6.367h-67.781c-12.15 0-22-9.85-22-22v-46.197c0-14.359-11.641-26-26-26h-62.95v4Z"
          //   clipRule="evenodd"
          //   style={{ pathLength: 0.1 }}
          animate={{ pathLength: 0.8 }}
        />
        <motion.path
          fill="url(#y)"
          fillRule="evenodd"
          d="m268.098 232.487 7.246-8.367-7.246-8.367v6.367H152.164v4h115.934v6.367Z"
          clipRule="evenodd"
        />
        <motion.path
          fill="url(#z)"
          fillRule="evenodd"
          d="m268.098 257.848 7.246-8.367-7.246-8.367v5.763h-52.686c-14.359 0-26 11.641-26 26v86.653c0 12.15-9.849 22-22 22h-20.079v4h20.079c14.36 0 26-11.641 26-26v-86.653c0-12.15 9.85-22 22-22h52.686v6.971Z"
          clipRule="evenodd"
        />
        <motion.path
          fill="url(#w)"
          fillRule="evenodd"
          d="m537.127 88.863 6.415 8.374-6.415 8.374V99.23h-32.482c-12.15 0-22 9.85-22 22v46.274c0 14.36-11.64 26-26 26h-33.967v-4h33.967c12.15 0 22-9.849 22-22V121.23c0-14.36 11.641-26 26-26h32.482v-6.367Z"
          clipRule="evenodd"
        />
        <motion.path
          fill="url(#x)"
          fillRule="evenodd"
          d="m559.974 353.339 6.414-8.376-6.414-8.375v6.383h-56.537c-12.15 0-22-9.85-22-22V274.68c0-14.36-11.64-26-26-26h-32.759v4h32.759c12.15 0 22 9.849 22 22v46.291c0 14.359 11.641 26 26 26h56.537v6.368Z"
          clipRule="evenodd"
        />
        <g filter="url(#B)">
          <circle cx="97.82" cy="244.563" r="42.268" fill="url(#C)" />
          <circle cx="97.82" cy="244.563" r="41.768" stroke="url(#D)" />
        </g>
        <g filter="url(#F)">
          <circle cx="617.109" cy="343.677" r="45.891" fill="url(#G)" />
          <circle cx="617.109" cy="343.677" r="45.391" stroke="url(#H)" />
        </g>
        {/* </motion.g> */}
        <defs>
          <linearGradient
            id="b"
            x1="339.35"
            x2="339.35"
            y1="109.147"
            y2="350.677"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".365" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".615" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".9" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="c"
            x1="339.35"
            x2="339.35"
            y1="48.765"
            y2="411.06"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".365" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".615" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".9" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="d"
            x1="339.35"
            x2="339.35"
            y1="-11.617"
            y2="471.442"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".365" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".615" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".9" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="e"
            x1="339.35"
            x2="339.35"
            y1="-72"
            y2="531.825"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0" />
            <stop offset=".365" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".615" stopColor="#fff" stopOpacity=".2" />
            <stop offset=".9" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="g"
            x1="42.699"
            x2="40.845"
            y1="56.257"
            y2="146.831"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity=".06" />
            <stop offset="1" stopColor="#fff" stopOpacity=".07" />
          </linearGradient>
          <linearGradient
            id="h"
            x1="45.287"
            x2="45.287"
            y1="56.257"
            y2="146.831"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EFF6FF" stopOpacity=".15" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="k"
            x1="91.16"
            x2="88.984"
            y1="334.016"
            y2="440.289"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity=".06" />
            <stop offset="1" stopColor="#fff" stopOpacity=".07" />
          </linearGradient>
          <linearGradient
            id="l"
            x1="94.197"
            x2="94.197"
            y1="334.016"
            y2="440.289"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EFF6FF" stopOpacity=".15" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="o"
            x1="345.388"
            x2="345.388"
            y1="154.076"
            y2="294.164"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1D987A" stopOpacity=".15" />
            <stop offset="1" stopColor="#16BE66" stopOpacity=".3" />
          </linearGradient>
          <linearGradient
            id="p"
            x1="345.388"
            x2="345.388"
            y1="154.076"
            y2="294.164"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00C165" stopOpacity=".32" />
            <stop offset="1" stopColor="#029785" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="q"
            x1="322.768"
            x2="352.167"
            y1="197.011"
            y2="255.96"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#33B394" />
            <stop offset="1" stopColor="#02C98D" stopOpacity=".61" />
          </linearGradient>
          <linearGradient
            id="s"
            x1="603.221"
            x2="603.221"
            y1="39.35"
            y2="158.907"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1D987A" stopOpacity=".15" />
            <stop offset="1" stopColor="#16BE66" stopOpacity=".3" />
          </linearGradient>
          <linearGradient
            id="t"
            x1="603.221"
            x2="603.221"
            y1="39.35"
            y2="158.907"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00C165" stopOpacity=".32" />
            <stop offset="1" stopColor="#029785" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="u"
            x1="584.974"
            x2="603.825"
            y1="81.391"
            y2="123.508"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00AA8B" />
            <stop offset="1" stopColor="#02C961" stopOpacity=".61" />
          </linearGradient>
          <linearGradient
            id="v"
            x1="252.053"
            x2="74.976"
            y1="183.738"
            y2="149.177"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00AA51" stopOpacity=".8" />
            <stop offset="1" stopColor="#00AA51" stopOpacity=".1" />
          </linearGradient>
          <linearGradient
            id="w"
            x1="446.585"
            x2="657.282"
            y1="180.866"
            y2="131.148"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00AA51" stopOpacity=".46" />
            <stop offset=".95" stopColor="#04ABB5" stopOpacity=".88" />
          </linearGradient>
          <linearGradient
            id="x"
            x1="446.585"
            x2="657.286"
            y1="261.321"
            y2="311.031"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00AA51" stopOpacity=".46" />
            <stop offset=".95" stopColor="#04ABB5" stopOpacity=".88" />
          </linearGradient>
          <linearGradient
            id="y"
            x1="257.229"
            x2="158.806"
            y1="224.19"
            y2="224.19"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#667279" />
            <stop offset="1" stopColor="#244253" stopOpacity=".53" />
          </linearGradient>
          <linearGradient
            id="z"
            x1="256.519"
            x2="154.236"
            y1="313.924"
            y2="313.924"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#667279" />
            <stop offset="1" stopColor="#244253" stopOpacity=".159" />
          </linearGradient>
          <linearGradient
            id="C"
            x1="95.404"
            x2="93.674"
            y1="202.296"
            y2="286.831"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity=".06" />
            <stop offset="1" stopColor="#fff" stopOpacity=".07" />
          </linearGradient>
          <linearGradient
            id="D"
            x1="97.82"
            x2="97.82"
            y1="202.296"
            y2="286.831"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EFF6FF" stopOpacity=".15" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="E"
            x1="97.057"
            x2="97.057"
            y1="219.744"
            y2="269.383"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" />
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity=".31" />
          </linearGradient>
          <linearGradient
            id="G"
            x1="617.109"
            x2="617.109"
            y1="297.787"
            y2="389.568"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#1D987A" stopOpacity=".15" />
            <stop offset="1" stopColor="#16BE66" stopOpacity=".3" />
          </linearGradient>
          <linearGradient
            id="H"
            x1="617.109"
            x2="617.109"
            y1="297.787"
            y2="389.568"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#00C165" stopOpacity=".32" />
            <stop offset="1" stopColor="#029785" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="I"
            x1="598.634"
            x2="619.05"
            y1="324.579"
            y2="367.511"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#33B394" />
            <stop offset="1" stopColor="#02C98D" stopOpacity=".61" />
          </linearGradient>
          <filter
            id="f"
            width="146.574"
            height="146.574"
            x="-28"
            y="28.257"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="14" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1490_149"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1490_149"
              result="shape"
            />
          </filter>
          <filter
            id="j"
            width="162.273"
            height="162.273"
            x="13.06"
            y="306.016"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="14" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1490_149"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1490_149"
              result="shape"
            />
          </filter>
          <filter
            id="n"
            width="148.087"
            height="148.087"
            x="271.344"
            y="150.076"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1490_149"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1490_149"
              result="shape"
            />
          </filter>
          <filter
            id="r"
            width="127.557"
            height="127.557"
            x="539.443"
            y="35.35"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1490_149"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1490_149"
              result="shape"
            />
          </filter>
          <filter
            id="A"
            width="72.076"
            height="72.076"
            x="98.011"
            y="63.694"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="13" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1490_149"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1490_149"
              result="shape"
            />
          </filter>
          <filter
            id="B"
            width="140.536"
            height="140.535"
            x="27.552"
            y="174.296"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="14" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1490_149"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1490_149"
              result="shape"
            />
          </filter>
          <filter
            id="F"
            width="99.781"
            height="99.781"
            x="567.218"
            y="293.787"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="2" />
            <feComposite
              in2="SourceAlpha"
              operator="in"
              result="effect1_backgroundBlur_1490_149"
            />
            <feBlend
              in="SourceGraphic"
              in2="effect1_backgroundBlur_1490_149"
              result="shape"
            />
          </filter>
          <pattern
            id="i"
            width="1"
            height="1"
            patternContentUnits="objectBoundingBox"
          >
            <use href="#J" transform="matrix(.00415 0 0 .00418 -.938 -.778)" />
          </pattern>
          <pattern
            id="m"
            width="1"
            height="1"
            patternContentUnits="objectBoundingBox"
          >
            <use href="#K" transform="scale(.00192 .00173)" />
          </pattern>
          <clipPath id="a-1">
            <path fill="#fff" d="M0 0h663v471H0z" />
          </clipPath>
        </defs>
      </motion.svg>
      <div className="icon-1 absolute left-22px top-80px" />
      <div className="icon-2 absolute left-69px top-360px" />
    </motion.div>
  )
}

export default Chart
