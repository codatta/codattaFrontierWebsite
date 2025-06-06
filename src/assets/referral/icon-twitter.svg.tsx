import { IconProps } from './icon.types'

export default function IconSettings(props: IconProps) {
  const size = props.size as number

  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx={16.5} cy={16} r={16} fill="#000" />
      <g clipPath="url(#clip0_7516_5868)">
        <path
          d="M8.083 8.124c.122.16 1.62 2.125 3.336 4.365a508.77 508.77 0 013.114 4.094c0 .012-1.117 1.298-2.48 2.86a2640.151 2640.151 0 01-3.78 4.326l-.06.068H10.92l2.43-2.78a267.892 267.892 0 012.456-2.785c.014-.006.983 1.245 2.157 2.777l2.127 2.785 2.732.003h2.732l-2.572-3.402-3.479-4.598c-.5-.661-.903-1.215-.897-1.236a471.14 471.14 0 012.927-3.363 619.825 619.825 0 002.936-3.366c.021-.026-.255-.035-1.321-.035h-1.348l-.471.539c-.261.3-1.266 1.452-2.238 2.56l-1.765 2.02-1.935-2.56-1.938-2.56H7.864l.219.288zm9.407 7.668l4.842 6.4-.735.01c-.67.005-.74.002-.785-.045-.05-.054-9.713-12.673-9.757-12.744-.018-.03.14-.036.788-.03l.809.01 4.838 6.4z"
          fill="#fff"
        />
      </g>
      <defs>
        <clipPath id="clip0_7516_5868">
          <path fill="#fff" transform="translate(4 6)" d="M0 0H21.0963V19.2H0z" />
        </clipPath>
      </defs>
    </svg>
  )
}
