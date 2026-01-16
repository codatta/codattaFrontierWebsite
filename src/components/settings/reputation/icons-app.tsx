const IconBox = ({ children }: { children: React.ReactNode }) => (
  <div className="flex size-[44px] items-center justify-center [&>svg]:size-[96px] [&>svg]:max-w-none [&>svg]:shrink-0">
    {children}
  </div>
)

export const Icon1App = () => (
  <IconBox>
    <svg width={96} height={96} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        style={{ mixBlendMode: 'multiply' }}
      />
      <g opacity="0.67">
        <mask
          id="mask0_45142_42523"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="-50"
          y="-50"
          width="196"
          height="196"
        >
          <rect width="196" height="196" transform="translate(-50 -50)" fill="white" />
          <rect x="26" y="26" width="44" height="44" rx="22" fill="black" />
        </mask>
        <g mask="url(#mask0_45142_42523)">
          <foreignObject x="-14" y="-12" width="124" height="124">
            <div
              style={{
                backdropFilter: 'blur(20px)',
                clipPath: 'url(#bgblur_0_45142_42523_clip_path)',
                height: '100%',
                width: '100%'
              }}
            ></div>
          </foreignObject>
          <g filter="url(#filter0_f_45142_42523)" data-figma-bg-blur-radius="40">
            <path
              d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z"
              fill="black"
              fillOpacity="0.04"
              style={{ mixBlendMode: 'hard-light' }}
            />
          </g>
        </g>
      </g>
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#333333"
        style={{ mixBlendMode: 'color-dodge' }}
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#F7F7F7"
        style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
      />
      <rect x="26" y="26" width="44" height="44" rx="22" fill="url(#paint0_radial_45142_42523)" />
      <path
        d="M46.007 38.1043C44.6054 37.6505 43.0818 38.2816 42.4116 39.5935L41.6058 41.1707C41.51 41.3581 41.3576 41.5105 41.1702 41.6063L39.5931 42.412C38.2812 43.0823 37.6501 44.6059 38.1038 46.0075L38.6492 47.6925C38.714 47.8927 38.714 48.1083 38.6492 48.3085L38.1038 49.9935C37.6501 51.3951 38.2812 52.9187 39.5931 53.589L41.1702 54.3947C41.3576 54.4905 41.51 54.6429 41.6058 54.8303L42.4116 56.4075C43.0818 57.7194 44.6054 58.3505 46.007 57.8968L47.692 57.3513C47.8922 57.2865 48.1078 57.2865 48.308 57.3513L49.993 57.8968C51.3946 58.3505 52.9182 57.7194 53.5885 56.4075L54.3942 54.8303C54.49 54.6429 54.6424 54.4905 54.8298 54.3947L56.407 53.589C57.7189 52.9187 58.35 51.3951 57.8963 49.9935L57.3508 48.3085C57.286 48.1083 57.286 47.8927 57.3508 47.6925L57.8963 46.0075C58.35 44.6059 57.7189 43.0823 56.407 42.412L54.8298 41.6063C54.6424 41.5105 54.49 41.3581 54.3942 41.1707L53.5885 39.5935C52.9182 38.2816 51.3946 37.6505 49.993 38.1043L48.308 38.6497C48.1078 38.7145 47.8922 38.7145 47.692 38.6497L46.007 38.1043ZM42.7598 47.7578L44.174 46.3435L47.0024 49.172L52.6593 43.5151L54.0735 44.9293L47.0024 52.0004L42.7598 47.7578Z"
        fill="black"
      />
      <defs>
        <filter
          id="filter0_f_45142_42523"
          x="-14"
          y="-12"
          width="124"
          height="124"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_45142_42523" />
        </filter>
        <clipPath id="bgblur_0_45142_42523_clip_path" transform="translate(14 12)">
          <path d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z" />
        </clipPath>
        <radialGradient
          id="paint0_radial_45142_42523"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 70) scale(54.0644 57.4399)"
        >
          <stop stopColor="#40E1EF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#40E1EF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </IconBox>
)

export const Icon2App = () => (
  <IconBox>
    <svg width={96} height={96} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        style={{ mixBlendMode: 'multiply' }}
      />
      <g opacity="0.67">
        <mask
          id="mask0_45487_10879"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="-50"
          y="-50"
          width="196"
          height="196"
        >
          <rect width="196" height="196" transform="translate(-50 -50)" fill="white" />
          <rect x="26" y="26" width="44" height="44" rx="22" fill="black" />
        </mask>
        <g mask="url(#mask0_45487_10879)">
          <foreignObject x="-14" y="-12" width="124" height="124">
            <div
              style={{
                backdropFilter: 'blur(20px)',
                clipPath: 'url(#bgblur_0_45487_10879_clip_path)',
                height: '100%',
                width: '100%'
              }}
            ></div>
          </foreignObject>
          <g filter="url(#filter0_f_45487_10879)" data-figma-bg-blur-radius="40">
            <path
              d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z"
              fill="black"
              fillOpacity="0.04"
              style={{ mixBlendMode: 'hard-light' }}
            />
          </g>
        </g>
      </g>
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#333333"
        style={{ mixBlendMode: 'color-dodge' }}
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#F7F7F7"
        style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
      />
      <rect x="26" y="26" width="44" height="44" rx="22" fill="url(#paint0_radial_45487_10879)" />
      <path
        d="M45.9994 47H38.0488C38.5505 41.9467 42.8141 38 47.9995 38C53.5223 38 57.9995 42.4771 57.9995 48C57.9995 53.5228 53.5223 58 47.9995 58C42.8141 58 38.5505 54.0533 38.0488 49H45.9994V52L50.9995 48L45.9994 44V47Z"
        fill="black"
      />
      <defs>
        <filter
          id="filter0_f_45487_10879"
          x="-14"
          y="-12"
          width="124"
          height="124"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_45487_10879" />
        </filter>
        <clipPath id="bgblur_0_45487_10879_clip_path" transform="translate(14 12)">
          <path d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z" />
        </clipPath>
        <radialGradient
          id="paint0_radial_45487_10879"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 70) scale(54.0644 57.4399)"
        >
          <stop stopColor="#40E1EF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#40E1EF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </IconBox>
)

export const Icon3App = () => (
  <IconBox>
    <svg width={96} height={96} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        style={{ mixBlendMode: 'multiply' }}
      />
      <g opacity="0.67">
        <mask
          id="mask0_45487_10911"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="-50"
          y="-50"
          width="196"
          height="196"
        >
          <rect width="196" height="196" transform="translate(-50 -50)" fill="white" />
          <rect x="26" y="26" width="44" height="44" rx="22" fill="black" />
        </mask>
        <g mask="url(#mask0_45487_10911)">
          <foreignObject x="-14" y="-12" width="124" height="124">
            <div
              style={{
                backdropFilter: 'blur(20px)',
                clipPath: 'url(#bgblur_0_45487_10911_clip_path)',
                height: '100%',
                width: '100%'
              }}
            ></div>
          </foreignObject>
          <g filter="url(#filter0_f_45487_10911)" data-figma-bg-blur-radius="40">
            <path
              d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z"
              fill="black"
              fillOpacity="0.04"
              style={{ mixBlendMode: 'hard-light' }}
            />
          </g>
        </g>
      </g>
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#333333"
        style={{ mixBlendMode: 'color-dodge' }}
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#F7F7F7"
        style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
      />
      <rect x="26" y="26" width="44" height="44" rx="22" fill="url(#paint0_radial_45487_10911)" />
      <path
        d="M57 46H47V53.3823C47 54.9449 47.7775 56.4053 49.074 57.2742L50.1569 58H39.9934C39.445 58 39 57.556 39 57.0082V38.9918C39 38.4553 39.4469 38 39.9983 38H51.9968L57 43V46ZM49 48H57V53.3823C57 54.2786 56.5544 55.1156 55.8125 55.6128L53 57.4978L50.1875 55.6128C49.4456 55.1156 49 54.2786 49 53.3823V48Z"
        fill="black"
      />
      <defs>
        <filter
          id="filter0_f_45487_10911"
          x="-14"
          y="-12"
          width="124"
          height="124"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_45487_10911" />
        </filter>
        <clipPath id="bgblur_0_45487_10911_clip_path" transform="translate(14 12)">
          <path d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z" />
        </clipPath>
        <radialGradient
          id="paint0_radial_45487_10911"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 70) scale(54.0644 57.4399)"
        >
          <stop stopColor="#40E1EF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#40E1EF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </IconBox>
)

export const Icon4App = () => (
  <IconBox>
    <svg width={96} height={96} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        style={{ mixBlendMode: 'multiply' }}
      />
      <g opacity="0.67">
        <mask
          id="mask0_45487_10943"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="-50"
          y="-50"
          width="196"
          height="196"
        >
          <rect width="196" height="196" transform="translate(-50 -50)" fill="white" />
          <rect x="26" y="26" width="44" height="44" rx="22" fill="black" />
        </mask>
        <g mask="url(#mask0_45487_10943)">
          <foreignObject x="-14" y="-12" width="124" height="124">
            <div
              style={{
                backdropFilter: 'blur(20px)',
                clipPath: 'url(#bgblur_0_45487_10943_clip_path)',
                height: '100%',
                width: '100%'
              }}
            ></div>
          </foreignObject>
          <g filter="url(#filter0_f_45487_10943)" data-figma-bg-blur-radius="40">
            <path
              d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z"
              fill="black"
              fillOpacity="0.04"
              style={{ mixBlendMode: 'hard-light' }}
            />
          </g>
        </g>
      </g>
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#333333"
        style={{ mixBlendMode: 'color-dodge' }}
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#F7F7F7"
        style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
      />
      <rect x="26" y="26" width="44" height="44" rx="22" fill="url(#paint0_radial_45487_10943)" />
      <path
        d="M46.007 38.1043C44.6054 37.6505 43.0818 38.2816 42.4116 39.5935L41.6058 41.1707C41.51 41.3581 41.3576 41.5105 41.1702 41.6063L39.5931 42.412C38.2812 43.0823 37.6501 44.6059 38.1038 46.0075L38.6492 47.6925C38.714 47.8927 38.714 48.1083 38.6492 48.3085L38.1038 49.9935C37.6501 51.3951 38.2812 52.9187 39.5931 53.589L41.1702 54.3947C41.3576 54.4905 41.51 54.6429 41.6058 54.8303L42.4116 56.4075C43.0818 57.7194 44.6054 58.3505 46.007 57.8968L47.692 57.3513C47.8922 57.2865 48.1078 57.2865 48.308 57.3513L49.993 57.8968C51.3946 58.3505 52.9182 57.7194 53.5885 56.4075L54.3942 54.8303C54.49 54.6429 54.6424 54.4905 54.8298 54.3947L56.407 53.589C57.7189 52.9187 58.35 51.3951 57.8963 49.9935L57.3508 48.3085C57.286 48.1083 57.286 47.8927 57.3508 47.6925L57.8963 46.0075C58.35 44.6059 57.7189 43.0823 56.407 42.412L54.8298 41.6063C54.6424 41.5105 54.49 41.3581 54.3942 41.1707L53.5885 39.5935C52.9182 38.2816 51.3946 37.6505 49.993 38.1043L48.308 38.6497C48.1078 38.7145 47.8922 38.7145 47.692 38.6497L46.007 38.1043ZM42.7598 47.7578L44.174 46.3435L47.0024 49.172L52.6593 43.5151L54.0735 44.9293L47.0024 52.0004L42.7598 47.7578Z"
        fill="black"
      />
      <defs>
        <filter
          id="filter0_f_45487_10943"
          x="-14"
          y="-12"
          width="124"
          height="124"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_45487_10943" />
        </filter>
        <clipPath id="bgblur_0_45487_10943_clip_path" transform="translate(14 12)">
          <path d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z" />
        </clipPath>
        <radialGradient
          id="paint0_radial_45487_10943"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(26 70) scale(54.0644 57.4399)"
        >
          <stop stopColor="#40E1EF" stopOpacity="0.2" />
          <stop offset="1" stopColor="#40E1EF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  </IconBox>
)

export const Icon5App = () => (
  <IconBox>
    <svg width={96} height={96} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        style={{ mixBlendMode: 'multiply' }}
      />
      <g opacity="0.67">
        <mask
          id="mask0_45201_42525"
          style={{ maskType: 'luminance' }}
          maskUnits="userSpaceOnUse"
          x="-50"
          y="-50"
          width="196"
          height="196"
        >
          <rect width="196" height="196" transform="translate(-50 -50)" fill="white" />
          <rect x="26" y="26" width="44" height="44" rx="22" fill="black" />
        </mask>
        <g mask="url(#mask0_45201_42525)">
          <foreignObject x="-14" y="-12" width="124" height="124">
            <div
              style={{
                backdropFilter: 'blur(20px)',
                clipPath: 'url(#bgblur_0_45201_42525_clip_path)',
                height: '100%',
                width: '100%'
              }}
            ></div>
          </foreignObject>
          <g filter="url(#filter0_f_45201_42525)" data-figma-bg-blur-radius="40">
            <path
              d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z"
              fill="black"
              fillOpacity="0.04"
              style={{ mixBlendMode: 'hard-light' }}
            />
          </g>
        </g>
      </g>
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#333333"
        style={{ mixBlendMode: 'color-dodge' }}
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="white"
        fillOpacity="0.5"
      />
      <path
        d="M26 48C26 35.8497 35.8497 26 48 26C60.1503 26 70 35.8497 70 48C70 60.1503 60.1503 70 48 70C35.8497 70 26 60.1503 26 48Z"
        fill="#F7F7F7"
        style={{ mixBlendMode: 'plus-darker' as React.CSSProperties['mixBlendMode'] }}
      />
      <rect x="26" y="26" width="44" height="44" rx="22" fill="black" fillOpacity="0.01" />
      <path
        d="M51.936 38.502L57.501 44.0669V51.937L51.936 57.502H44.0659L38.501 51.937V44.0669L44.0659 38.502H51.936ZM47.0002 51.0012V53.0012H49.0002V51.0012H47.0002ZM47.0002 43.0012V49.0012H49.0002V43.0012H47.0002Z"
        fill="#FF9072"
      />
      <defs>
        <filter
          id="filter0_f_45201_42525"
          x="-14"
          y="-12"
          width="124"
          height="124"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="10" result="effect1_foregroundBlur_45201_42525" />
        </filter>
        <clipPath id="bgblur_0_45201_42525_clip_path" transform="translate(14 12)">
          <path d="M26 50C26 37.8497 35.8497 28 48 28C60.1503 28 70 37.8497 70 50C70 62.1503 60.1503 72 48 72C35.8497 72 26 62.1503 26 50Z" />
        </clipPath>
      </defs>
    </svg>
  </IconBox>
)
