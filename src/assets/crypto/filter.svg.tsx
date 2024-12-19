import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg
      width={size}
      height={(size * 25) / 24}
      viewBox="0 0 14 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.58334 0.5H12.4167C13.1067 0.5 13.6667 1.06 13.6667 1.75V3.63082C13.6667 3.96249 13.535 4.27999 13.3009 4.51499L9.03329 8.7825C8.79912 9.01666 8.66748 9.335 8.66748 9.66667V15.5L5.33415 13V9.66667C5.33415 9.335 5.20251 9.0175 4.96835 8.7825L0.70087 4.51499C0.466704 4.28083 0.334965 3.96249 0.334965 3.63082V1.75C0.333298 1.06 0.893337 0.5 1.58334 0.5Z"
        fill={color}
        stroke={color}
      />
    </svg>
  )
}
