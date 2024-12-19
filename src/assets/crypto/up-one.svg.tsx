import { IconProps } from './icon.types'

export default function UpOne(props: IconProps) {
  const color = props.color || 'currentColor'
  // const strokeWidth = props.strokeWidth || 1.66667
  const size = props.size || '1em'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 8.95825L7 5.45825L10.5 8.95825H3.5Z"
        fill={color}
        stroke={color}
        strokeOpacity="0.929412"
        strokeWidth="1.16667"
        strokeLinejoin="round"
      />
    </svg>
  )
}
