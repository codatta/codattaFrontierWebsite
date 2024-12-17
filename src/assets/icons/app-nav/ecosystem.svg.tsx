import { IconProps } from './icon.types'

export default function Icon(props: IconProps) {
  const color = props.color || 'currentColor'
  //   const strockWidth = props.strokeWidth || 1.66667
  const size = props.size || 24

  return (
    <svg
      width={size}
      height={(size * 25) / 24}
      viewBox="0 0 24 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 12.905C21 17.8756 16.9706 21.905 12 21.905M21 12.905C21 7.93447 16.9706 3.90503 12 3.90503M21 12.905C21 10.972 16.9706 9.40503 12 9.40503C7.02944 9.40503 3 10.972 3 12.905M21 12.905C21 14.838 16.9706 16.405 12 16.405C7.02944 16.405 3 14.838 3 12.905M12 21.905C7.02944 21.905 3 17.8756 3 12.905M12 21.905C14.2091 21.905 16 17.8756 16 12.905C16 7.93447 14.2091 3.90503 12 3.90503M12 21.905C9.79086 21.905 8 17.8756 8 12.905C8 7.93447 9.79086 3.90503 12 3.90503M3 12.905C3 7.93447 7.02944 3.90503 12 3.90503"
        stroke={color}
        strokeWidth="1.2"
      />
    </svg>
  )
}
