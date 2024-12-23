import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg width={size} height={(size * 25) / 24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.00002 19.7517C8.80802 19.7517 8.61599 19.6788 8.46999 19.5318C8.17699 19.2388 8.17699 18.7637 8.46999 18.4707L14.94 12.0008L8.46999 5.53079C8.17699 5.23779 8.17699 4.76275 8.46999 4.46975C8.76299 4.17675 9.23803 4.17675 9.53103 4.46975L16.531 11.4697C16.824 11.7628 16.824 12.2378 16.531 12.5308L9.53103 19.5308C9.38403 19.6788 9.19202 19.7517 9.00002 19.7517Z"
        fill="white"
        stroke={color}
      />
    </svg>
  )
}
