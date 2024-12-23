import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  // const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg width={size} height={(size * 25) / 24} viewBox="0 0 32 33" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.9411 3.51562C8.74441 3.51562 2.91075 9.34929 2.91075 16.5459C2.91075 23.7426 8.74441 29.5762 15.9411 29.5762C23.1377 29.5762 28.9714 23.7426 28.9714 16.5459C28.9714 9.34929 23.1377 3.51562 15.9411 3.51562ZM19.2378 17.2366L15.3287 21.1457C15.1384 21.3359 14.8882 21.4323 14.638 21.4323C14.3878 21.4323 14.1376 21.3372 13.9474 21.1457C13.5656 20.7639 13.5656 20.1449 13.9474 19.7631L17.1658 16.5447L13.9474 13.3262C13.5656 12.9444 13.5656 12.3254 13.9474 11.9436C14.3292 11.5619 14.9481 11.5619 15.3299 11.9436L19.239 15.8527C19.6195 16.2371 19.6195 16.8548 19.2378 17.2366Z"
        fill="#BBBBBE"
      />
    </svg>
  )
}
